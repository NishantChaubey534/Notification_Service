
const Notification = require('../models/Notification');

const sendInAppNotification = async (userId, title, message) => {
  try {
    console.log(`In-app notification sent to user ${userId}: ${title} - ${message}`);
    
    return { success: true };
  } catch (err) {
    console.error('In-app notification failed:', err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendInAppNotification };