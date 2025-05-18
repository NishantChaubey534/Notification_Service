const { getChannel } = require("./connection");
const Notification = require("../models/Notification");
const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");
const { sendInAppNotification } = require("../services/inAppService");

const MAX_RETRIES = 3;

const processNotification = async (msg) => {
  const notification = JSON.parse(msg.content.toString());

  try {
    const metadata = notification.metadata || {};
    let result;

    if (
      !notification.userId ||
      !notification.type ||
      !notification.title ||
      !notification.message
    ) {
      throw new Error("Missing required notification fields");
    }

    await Notification.findByIdAndUpdate(notification._id, {
      status: "pending",
      updatedAt: new Date(),
    });

    if (notification.type === "email") {
      if (!metadata.email) throw new Error("Missing email in metadata");
      result = await sendEmail(
        metadata.email,
        notification.title,
        notification.message
      );
    } else if (notification.type === "sms") {
      if (!metadata.phone) throw new Error("Missing phone in metadata");
      result = await sendSMS(metadata.phone, notification.message);
    } else if (notification.type === "in-app") {
      result = await sendInAppNotification(
        notification.userId,
        notification.title,
        notification.message
      );
    } else {
      throw new Error("Invalid notification type");
    }

    if (result.success) {
      await Notification.findByIdAndUpdate(notification._id, {
        status: "sent",
        updatedAt: new Date(),
      });
      console.log(`Sent notification ${notification._id}`);
    } else {
      throw new Error(result.error || "Not able to send the notification");
    }
  } catch (error) {
    console.error(
      `Problem with notification ${notification._id}:`,
      error.message
    );

    if (notification.retryCount < MAX_RETRIES) {
      const updatedNotification = await Notification.findByIdAndUpdate(
        notification._id,
        {
          retryCount: notification.retryCount + 1,
          status: "pending",
          updatedAt: new Date(),
        },
        { new: true }
      );

      const { sendToNotificationQueue } = require("./notificationProducer");
      await sendToNotificationQueue(updatedNotification.toObject());

      console.log(
        `Retrying notification ${notification._id} (Attempt ${updatedNotification.retryCount})`
      );
    } else {
      await Notification.findByIdAndUpdate(notification._id, {
        status: "failed",
        updatedAt: new Date(),
      });
      console.log(
        `Limit of retry is reached for notification ${notification._id} after ${MAX_RETRIES} tries`
      );
    }
  } finally {
    getChannel().ack(msg);
  }
};

const startNotificationConsumer = async () => {
  try {
    const channel = getChannel();
    await channel.assertQueue("notifications", { durable: true });
    channel.prefetch(1);
    console.log("Ready to process notifications");
    channel.consume("notifications", processNotification);
  } catch (error) {
    console.error("Failed to start consumer:", error.message);
    setTimeout(startNotificationConsumer, 5000);
  }
};

module.exports = { startNotificationConsumer };
