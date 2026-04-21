require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 ENVIRONMENT CHECK');
console.log('===================');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length || 0, 'characters');
console.log('EMAIL_PASS contains spaces:', process.env.EMAIL_PASS?.includes(' ') ? 'YES ❌' : 'NO ✅');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ ERROR: Email credentials missing');
    process.exit(1);
}

if (process.env.EMAIL_PASS.includes(' ')) {
    console.log('❌ ERROR: Password contains spaces! Remove all spaces.');
    console.log('Current password with spaces:', process.env.EMAIL_PASS);
    console.log('Should be like: mfdsasfwewefewfewf');
    process.exit(1);
}

// Test email
async function sendTest() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        console.log('Testing connection...');
        await transporter.verify();
        console.log('✅ Connection successful!');

        console.log('Sending test email...');
        await transporter.sendMail({
            from: `"Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'If you get this, email works!'
        });
        console.log('✅ Test email sent! Check your inbox.');
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

sendTest();