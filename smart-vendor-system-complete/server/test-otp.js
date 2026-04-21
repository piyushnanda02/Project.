require('dotenv').config();
const nodemailer = require('nodemailer');

async function testOTP() {
    console.log('📧 Testing OTP Email Configuration');
    console.log('==================================');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass length:', process.env.EMAIL_PASS?.length || 0, 'characters');
    console.log('');

    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ ERROR: Email credentials missing in .env file');
        console.log('Please add:');
        console.log('EMAIL_USER=piyushgamerindia@gmail.com');
        console.log('EMAIL_PASS=your-16-digit-app-password');
        return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Test connection
    try {
        console.log('Testing connection to Gmail...');
        await transporter.verify();
        console.log('✅ Connection successful!');
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('');
        console.log('Common issues:');
        console.log('1. App password is incorrect');
        console.log('2. 2-Factor Authentication not enabled');
        console.log('3. Less secure app access blocked');
        return;
    }

    // Send test email
    try {
        console.log('');
        console.log('Sending test email...');
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const info = await transporter.sendMail({
            from: `"Smart Vendor Ledger" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'OTP Test - Smart Vendor Ledger',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                    <h2 style="color: #333;">OTP Test</h2>
                    <p>Your OTP is: <strong style="font-size: 24px; color: #667eea;">${otp}</strong></p>
                    <p>This is a test email to verify OTP functionality.</p>
                </div>
            `
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox at:', process.env.EMAIL_USER);
        console.log('OTP was:', otp);
    } catch (error) {
        console.log('❌ Failed to send email:', error.message);
    }
}

testOTP();