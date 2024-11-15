const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/test-email', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    
    await transporter.verify();
    
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USERNAME}>`,
      to: req.body.email, 
      subject: "Test Email from Book Exchange",
      text: "If you receive this email, the email configuration is working correctly.",
      html: `
        <div style="padding: 20px; background-color: #f5f5f5;">
          <h2>Email Configuration Test</h2>
          <p>If you receive this email, the email configuration is working correctly.</p>
          <p>Configuration details:</p>
          <ul>
            <li>Sender: ${process.env.EMAIL_FROM_NAME}</li>
            <li>Email: ${process.env.EMAIL_USERNAME}</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
        </div>
      `
    });

    res.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email configuration error',
      error: error.message 
    });
  }
});

module.exports = router;