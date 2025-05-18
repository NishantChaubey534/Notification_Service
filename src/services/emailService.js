const nodemailer = require('nodemailer');

const mockEmailStore = [];

const getTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return null;
};

const sendEmail = async (to, subject, text, html = null) => {
  if (process.env.NODE_ENV !== 'production') {
    const testEmail = {
      to,
      subject: `${subject}`,
      text,
      html,
      timestamp: new Date()
    };

    mockEmailStore.push(testEmail);

    console.log(`Simulated Email\nTo: ${to}\nSubject: ${testEmail.subject}`);
    if (html) console.log(`HTML: ${html.substring(0, 50)}...`);
    console.log(`Text: ${text.substring(0, 50)}...\n`);

    return {
      success: true,
      mode: 'simulated',
      testId: `mock-${Date.now()}`,
      preview: testEmail
    };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"Notification Service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    return {
      success: true,
      mode: 'production',
      messageId: info.messageId
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      mode: 'production'
    };
  }
};

const getMockEmails = () => [...mockEmailStore];

module.exports = {
  sendEmail,
  getMockEmails
};
