const amqp = require("amqplib");
const dotenv = require("dotenv");

dotenv.config();

let channel = null;
const connect = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    await channel.assertQueue("notifications", { durable: true });
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
    throw err;
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

module.exports = { connect, getChannel };
