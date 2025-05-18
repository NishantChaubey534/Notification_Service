const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { apiLimiter, strictLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);

router.post('/notifications',strictLimiter, notificationController.sendNotification);

router.get('/users/:id/notifications', notificationController.getUserNotifications);

module.exports = router;