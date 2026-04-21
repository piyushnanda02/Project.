require('dotenv').config();
const nodemailer = require('nodemailer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 GMAIL AUTHENTICATION FIXER');
console.log('=============================');
console.log('Current Email:', process.env.EMAIL_USER);
console.log('Current Password length:', process.env.EMAIL_PASS?.length || 0, 'characters');
console.log('');

if (process.env.EMAIL_PASS?.length !== 16) {
    console.log('❌ ERROR: Your password should be exactly 16 characters');
    console.log('Current length:', process.env.EMAIL_PASS?.length, 'characters');
    console.log('');
}

console.log('To fix this:');
console.log('1. Go to: https://myaccount.google.com/apppasswords');
console.log('2. Sign in with:', 'nandapiyush3@gmail.com');
console.log('3. Generate a new app password for "Mail"');
console.log('4. Copy the 16-character code (remove spaces)');
console.log('');

rl.question('Enter your new 16-character app password: ', (newPassword) => {
    // Remove any spaces
    newPassword = newPassword.replace(/\s/g, '');
    
    if (newPassword.length !== 16) {
        console.log(`❌ Error: Password must be 16 characters. You entered ${newPassword.length}`);
        rl.close();
        return;
    }

    // Read current .env
    const fs = require('fs');
    const envPath = './.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace EMAIL_PASS line
    envContent = envContent.replace(
        /EMAIL_PASS=.*/,
        `EMAIL_PASS=${newPassword}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated!');
    
    // Test the new password
    testEmail(newPassword);
    rl.close();
});

async function testEmail(password) {
    console.log('\n📧 Testing new credentials...');
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: password
        }
    });

    try {
        await transporter.verify();
        console.log('✅ Connection successful!');
        
        // Send test email
        await transporter.sendMail({
            from: `"Smart Vendor Ledger" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Email Working!',
            text: 'Your email configuration is now correct!'
        });
        console.log('✅ Test email sent! Check your inbox.');
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}