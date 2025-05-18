const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection problem:', err.message));

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/", notificationRoutes);

app.use((err, req, res, next) => {
  console.log('Server error:', err.message);
  res.status(500).json({ error: "Internal Server Error"});
});

module.exports = app;