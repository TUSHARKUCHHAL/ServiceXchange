const nodemailer = require('nodemailer');

// Initialize nodemailer transport (configure based on your email provider)
// For development purposes, you can use services like Mailtrap, SendGrid, or Gmail
const transport = nodemailer.createTransport({
  // For example, using SendGrid:
  service: 'SendGrid', // Change to your email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
  
  // Or for SMTP configuration:
  /*
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  secure: true // use TLS
  */
});

/**
 * Send email using configured transport
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject 
 * @param {String} options.text - Plain text email body (optional)
 * @param {String} options.html - HTML email body (optional)
 * @returns {Promise}
 */
const sendEmail = async (options) => {
  const message = {
    from: `"Service Exchange" <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text || '',
    html: options.html || ''
  };

  try {
    const info = await transport.sendMail(message);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;