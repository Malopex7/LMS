const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 * @param {Array} [options.attachments] - Array of attachments
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
  try {
    // Create transporter with error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify SMTP connection configuration
    await transporter.verify();

    // Default email template wrapper
    const wrappedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${options.subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
            }
            .content {
              padding: 20px;
              background: #ffffff;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${process.env.FROM_NAME || 'LMS System'}</h2>
          </div>
          <div class="content">
            ${options.html}
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} ${process.env.FROM_NAME || 'LMS System'}. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    // Define email options with proper error handling for missing fields
    if (!options.email) throw new Error('Recipient email is required');
    if (!options.subject) throw new Error('Email subject is required');
    if (!options.html) throw new Error('Email content is required');

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'LMS System'} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: wrappedHtml,
      attachments: options.attachments || [],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail; 