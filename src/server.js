const app = require('./app');
const { connect } = require('./queues/connection');
const { startNotificationConsumer } = require('./queues/notificationConsumer');

const PORT = process.env.PORT || 3000;

connect()
  .then(() => startNotificationConsumer())
  .catch(err => console.error('Queue setup error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});