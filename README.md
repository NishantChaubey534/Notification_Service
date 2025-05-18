# 📬 Notification Service

A scalable, environment-aware notification service supporting Email, SMS, and In-App notifications. Built using Node.js, Express, MongoDB, RabbitMQ, and microservice design principles.

 **Note:** This Application is implemented both in development and production so if you want to test the API's quickly you can setup NODE_ENV=development  or vice-versa.
---

## 📦 Features

- Sends Email, SMS, and In-App notifications
- Respects user preferences
- Simulated delivery in development mode
- Production-ready email/SMS integration (Nodemailer, Twilio)
- Retry mechanism for failed notifications (up to 3 times)
- MongoDB for user and notification persistence
- RabbitMQ for asynchronous processing

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/NishantChaubey534/Notification-Service.git
cd Notification-Service
```

### 2. Install Dependencies

```bash
npm install
npm install express mongoose dotenv body-parser amqplib nodemailer twilio
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

MONGODB_URI=your_mongo_uri
RABBITMQ_URL=your_rabbitmq_url

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

> ℹ️ **Note:** Use [Gmail App Password](https://support.google.com/accounts/answer/185833?hl=en) for `EMAIL_PASS`.

---

### 4. Start MongoDB and RabbitMQ

Make sure your MongoDB and RabbitMQ instances are running. You can use Docker or a cloud provider like MongoDB Atlas and CloudAMQP.

---

### 5. Start the Server

```bash
npm run dev or node server.js
```

You should see:

```bash
Server running on port 3000
MongoDB Connected
Connected to RabbitMQ
Ready to process notifications
```

## 🌐 Live Demo

[Click here to access the live Notification Service](https://notification-service-rt8c.onrender.com)

> 🟢 You’ll see "Notification Service is running Live..." on the homepage. Use tools like Postman to test the API endpoints.

---

## 📬 API Endpoints   [API Documentation Download](./API_DOCUMENTATION.md)

### ➕ Create User

```
POST /users
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": true,
    "inAppNotifications": true
  }
}


📤 Successful Response:
{
"_id":{"$userId":"6829cdeabcc11961b1b49d33"},
"name":"John Doe",
"email":"john@example.com",
 "preferences": {
    "emailNotifications": true,
    "smsNotifications": true,
    "inAppNotifications": true
  }
"__v":{"$numberInt":"0"}
}
```

---

### 🔔 Send Notification

```
POST /notifications
```

```json
{
  "userId": "user_id",
  "type": "email",
  "title": "Your order has shipped",
  "message": "Your order is on its way!",
  "metadata": {
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}


📤 Successful Response:
Status: 201 Created
{
"message": "Notification is processed",
"notificationId": "NOTIFICATION_OBJECT_ID"
}
```

---

### 📃 Get Notifications for a User

```
GET /users/:id/notifications?limit=10&offset=0
```
```
Retrieve all notifications sent to a specific user.

📤 Successful Response:
**Status:** `200 OK`
  {
    "_id": "NOTIFICATION_ID",
    "userId": "USER_ID",
     "type": "email | sms | in-app",
    "title": "Title",
    "message": "Message body",
    "status": "pending | sent | failed",
    "retryCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
```

## 🧠 Assumptions

- **Notification delivery depends on metadata**: `email` for email, `phone` for SMS are required in the `metadata` field.
- **Environment-dependent behavior**:
  - In **production**, actual emails and SMS are sent.
  - In **development**, messages are logged/simulated (no real delivery).
- **Retries**: Notifications are retried up to 3 times on failure.
- **User preferences** are respected before sending notifications.

---

## 🧪 Development Notes

- Email simulation: `console.log` preview + stored mock (can be extended for unit testing).
- SMS simulation uses Twilio's testing number (`+15005550006`).
- Modular design: services (`emailService`, `smsService`, etc.) are easily testable.

---

## 📁 Project Structure

```
Notification-Service/
├── src/
│ ├── controllers/
│ │ └── notificationController.js
│ ├── models/
│ │ ├── Notification.js
│ │ └── User.js
│ ├── queues/
│ │ ├── connection.js
│ │ ├── notificationConsumer.js
│ │ └── notificationProducer.js
│ ├── routes/
│ │ ├── notificationRoutes.js
│ │ └── userRoutes.js
│ ├── services/
│ │ ├── emailService.js
│ │ ├── smsService.js
│ │ └── inAppService.js
│ ├── app.js
│ └── server.js
├── .env
├── README.md
├── API_DOCUMENTATION.md
├── package.json
└── .gitignore
```

---

## 🔒 Security Notes

- Use environment-specific `.env` files or secret managers in production.
- Ensure HTTPS and validation middleware in real-world deployments.
