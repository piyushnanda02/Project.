const fs = require('fs');
const path = require('path');

console.log('🔧 EMAIL CONFIGURATION FIX UTILITY');
console.log('===================================');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('Creating template .env file...');
    
    const envTemplate = `PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vendorDB
JWT_SECRET=smartVendorSecretKey
JWT_EXPIRE=30d
EMAIL_USER=piyushgamerindia@gmail.com
EMAIL_PASS=YOUR_16_DIGIT_APP_PASSWORD_HERE
FRONTEND_URL=http://localhost:3000
NODE_ENV=development`;

    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env file');
    console.log('⚠️  Please edit .env and add your actual app password!');
} else {
    console.log('✅ .env file exists');
    
    // Read and check .env content
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    let emailUser = '';
    let emailPass = '';
    
    lines.forEach(line => {
        if (line.startsWith('EMAIL_USER=')) {
            emailUser = line.split('=')[1];
        }
        if (line.startsWith('EMAIL_PASS=')) {
            emailPass = line.split('=')[1];
        }
    });
    
    console.log('📧 Email User:', emailUser || 'Not set');
    console.log('🔑 Email Pass:', emailPass ? '✓ Set' : '✗ Not set');
    
    if (emailPass === 'YOUR_16_DIGIT_APP_PASSWORD_HERE' || !emailPass) {
        console.log('\n⚠️  You need to set your actual app password!');
        console.log('Steps to get app password:');
        console.log('1. Go to https://myaccount.google.com/security');
        console.log('2. Enable 2-Factor Authentication');
        console.log('3. Go to App Passwords');
        console.log('4. Generate new app password for "Mail"');
        console.log('5. Copy the 16-digit password');
        console.log('6. Update EMAIL_PASS in .env file');
    }
}

console.log('\n✅ Fix utility complete!');