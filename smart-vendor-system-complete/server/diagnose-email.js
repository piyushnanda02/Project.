require('dotenv').config();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('./models/User');

async function diagnoseEmail() {
    console.log('🔍 COMPLETE EMAIL DIAGNOSTIC');
    console.log('============================');
    
    // Check 1: Environment variables
    console.log('\n1️⃣ CHECKING ENVIRONMENT:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length || 0, 'characters');
    console.log('Contains spaces:', process.env.EMAIL_PASS?.includes(' ') ? 'YES ❌' : 'NO ✅');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ ERROR: Email credentials missing in .env');
        return;
    }
    
    if (process.env.EMAIL_PASS.length !== 16) {
        console.log('❌ ERROR: Password should be 16 characters, got', process.env.EMAIL_PASS.length);
    }
    
    // Check 2: MongoDB connection
    console.log('\n2️⃣ CHECKING MONGODB:');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        
        // Check if user exists
        const testEmail = '23bai70192@cuchd.in';
        const user = await User.findOne({ email: testEmail });
        if (user) {
            console.log(`✅ User found: ${testEmail}`);
        } else {
            console.log(`❌ User not found: ${testEmail}`);
            console.log('   You need to register this email first!');
        }
    } catch (error) {
        console.log('❌ MongoDB error:', error.message);
    }
    
    // Check 3: Email connection
    console.log('\n3️⃣ TESTING EMAIL CONNECTION:');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    try {
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        
        // Try sending test email
        console.log('\n4️⃣ SENDING TEST EMAIL:');
        const info = await transporter.sendMail({
            from: `"Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'If you get this, email works!'
        });
        console.log('✅ Test email sent! Check inbox');
    } catch (error) {
        console.log('❌ Email error:', error.message);
        
        if (error.message.includes('Username and Password not accepted')) {
            console.log('\n🔑 SOLUTION: Your app password is WRONG');
            console.log('1. Go to: https://myaccount.google.com/apppasswords');
            console.log('2. Generate NEW app password');
            console.log('3. Copy the 16-char code (remove spaces)');
            console.log('4. Update .env file');
        }
    }
    
    await mongoose.connection.close();
}

diagnoseEmail();