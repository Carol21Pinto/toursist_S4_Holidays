const nodemailer = require('nodemailer');

// Gmail transporter - FIXED METHOD NAME
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail for sending
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password
  }
});

// Beautiful OTP email template
const createOTPEmail = (otp, recipientEmail) => {
  return {
    from: `"S4 Holidays Admin" <${process.env.GMAIL_USER}>`,
    to: recipientEmail,
    subject: '🔐 Password Reset OTP - S4 Holidays Admin Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ff7b54, #ff9a76); padding: 30px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; text-align: center; }
          .otp-box { background: linear-gradient(135deg, #4ecdc4, #45b7d1); color: white; padding: 20px; border-radius: 10px; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
          .footer { background: #2c3e50; color: #bdc3c7; padding: 20px; text-align: center; font-size: 14px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: left; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏔️ S4 Holidays</h1>
            <p>Admin Portal Security</p>
          </div>
          
          <div class="content">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">Password Reset Request</h2>
            <p style="color: #7f8c8d; margin-bottom: 30px;">
              Hello Admin,<br>
              You've requested to reset your password. Use this OTP to continue:
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 16px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 14px;">Valid for 10 minutes</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              • This OTP expires in 10 minutes<br>
              • Don't share this code with anyone<br>
              • If you didn't request this, ignore this email
            </div>
            
            <p style="color: #95a5a6; font-size: 14px; margin-top: 30px;">
              Need help? Contact S4 Holidays support team.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 S4 Holidays. All rights reserved.</p>
            <p>Professional Travel Management System</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = createOTPEmail(otp, email);
    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
