const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('Email User:', process.env.EMAIL_USER);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ Server is ready to send emails');
  } catch (error) {
    console.error('❌ Transporter verification failed:', error.message);
    return;
  }

  // Send test email
  try {
    const info = await transporter.sendMail({
      from: `"Smart Vendor Ledger" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from Smart Vendor Ledger',
      html: `
        <h1>Email Test Successful! 🎉</h1>
        <p>Your email configuration is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
};

testEmail();