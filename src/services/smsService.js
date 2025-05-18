const sendSMS = async (to, message) => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const fromNumber = '+15005550006';
    console.log(`Simulated SMS: From ${fromNumber} to ${to}: ${message}`);
    return {
      success: true,
      testMode: true,
      message: 'Simulated SMS message (no real delivery)',
      from: fromNumber,
      to,
      sid: 'SIMULATED_SID'
    };
  }
 
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  try {
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to
    });

    console.log('SMS sent');
    return {
      success: true,
      message: 'SMS sent successfully',
      from: fromNumber,
      to,
      sid: response.sid
    };
  } catch (err) {
    console.error('SMS failed:', err.message);
    return {
      success: false,
      error: err.message
    };
  }
};

module.exports = { sendSMS };
