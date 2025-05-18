# 📘 API Documentation

This document provides a reference for all available API endpoints in the Notification Service.

---

## 🧑‍💼 Create User

**POST** `/users`

Creates a new user.

### Request Body

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
```

### Response

- `201 Created` with the created user object
- `400 Bad Request` if fields are missing or invalid

---

## 📤 Send Notification

**POST** `/notifications`

Sends a notification to a user.

### Request Body

```json
{
  "userId": "USER_ID",
  "type": "email | sms | in-app",
  "title": "Your notification title",
  "message": "Notification message body",
  "metadata": {
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### Response

- `201 Created` with a success message and notification ID
- `400 Bad Request` if user has opted out or type is invalid
- `404 Not Found` if the user doesn't exist

---

## 📬 Get User Notifications

**GET** `/users/:id/notifications?limit=10&offset=0`

Retrieves notifications for a user, paginated.

### Path Parameter

- `id`: The user ID

### Query Parameters

- `limit`: (Optional) Number of notifications to return (default: 10)
- `offset`: (Optional) Number of notifications to skip (default: 0)

### Response

- `200 OK` with a list of notifications

```json
[
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
]
```

---

## 🚫 Error Responses

- `400 Bad Request`: Invalid input or missing required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected issues on the server

---

## ✅ Health Check

**GET** `/`

Basic confirmation that the service is live.

### Response

```
Notification Service is running Live. Hit the API endpoints to get the results, best works in Postman.
```