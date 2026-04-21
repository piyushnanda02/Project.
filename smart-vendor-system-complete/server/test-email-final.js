require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailSetup() {
    console.log('📧 EMAIL CONFIGURATION TEST');
    console.log('===========================');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS ? '✓ Password exists' : '✗ Password missing');
    console.log('');

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
        console.log('✅ SUCCESS: Connected to Gmail server');
    } catch (error) {
        console.log('❌ FAILED: Cannot connect to Gmail');
        console.log('Error:', error.message);
        return;
    }

    // Send test email
    try {
        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: `"Smart Vendor Ledger" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email - Smart Vendor Ledger',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4F46E5;">Email Test Successful! 🎉</h2>
                    <p>Your email configuration is working perfectly.</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Server:</strong> Smart Vendor Ledger Backend</p>
                </div>
            `
        });
        
        console.log('✅ SUCCESS: Test email sent!');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox at:', process.env.EMAIL_USER);
    } catch (error) {
        console.log('❌ FAILED: Could not send email');
        console.log('Error:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔑 SOLUTION: Your app password is incorrect');
            console.log('1. Go to https://myaccount.google.com/apppasswords');
            console.log('2. Generate a new app password');
            console.log('3. Update your .env file with the new password');
        }
    }
}

testEmailSetup();