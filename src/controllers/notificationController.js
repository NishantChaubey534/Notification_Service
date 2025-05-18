const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendToNotificationQueue } = require("../queues/notificationProducer");

const sendNotification = async (req, res) => {
  try {
    const { userId, type, title, message, metadata = {} } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validTypes = ["email", "sms", "in-app"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ error: "We only support email, SMS, or in-app notifications" });
    }

    const userAllowsNotification = {
      email: user.preferences.emailNotifications,
      sms: user.preferences.smsNotifications,
      "in-app": user.preferences.inAppNotifications,
    };

    if (!userAllowsNotification[type]) {
      return res.status(400).json({
        error: "This user has opted out of receiving this type of notification",
      });
    }

    const newNotification = await Notification.create({
      userId,
      type,
      title,
      message,
      metadata,
      status: "pending",
    });

    await sendToNotificationQueue(newNotification.toObject());

    res.status(201).json({
      success: true,
      message: "Your notification is processed",
      notificationId: newNotification._id,
    });
  } catch (err) {
    console.error("Something went wrong while sending notification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.json(notifications);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    res
      .status(500)
      .json({ error: "There is an issue retrieving notifications" });
  }
};

module.exports = { sendNotification, getUserNotifications };
