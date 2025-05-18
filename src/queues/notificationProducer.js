const { getChannel } = require('./connection');

const sendToNotificationQueue = async (notificationData) => {
  try {
    const channel = getChannel();
    await channel.sendToQueue(
      'notifications',
      Buffer.from(JSON.stringify(notificationData)),
      { persistent: true }
    );
    console.log('Notification sent to queue');
    return true;
  } catch (error) {
    console.error('Error sending to queue:', error);
    throw error;
  }
};

module.exports = { sendToNotificationQueue };