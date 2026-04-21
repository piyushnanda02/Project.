const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'src/index.js',
    'src/index.css',
    'src/App.js',
    'src/pages/Login.jsx',
    'src/pages/Register.jsx',
    'src/pages/ForgotPassword.jsx',
    'src/pages/Dashboard/DashboardHome.jsx'
];

console.log('🔍 Checking React Files...\n');

filesToCheck.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ ${file} - Found`);
    } else {
        console.log(`❌ ${file} - MISSING!`);
    }
});

console.log('\n📁 Current Directory:', __dirname);