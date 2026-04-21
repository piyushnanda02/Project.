const { exec } = require('child_process');
const fs = require('fs');

// Create screenshots directory if not exists
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

console.log(`
╔══════════════════════════════════════════════════════════╗
║     UPI GATEWAY - SELENIUM AUTOMATION TESTING           ║
║     Experiment 09                                       ║
╚══════════════════════════════════════════════════════════╝
`);

console.log('🚀 Running automated test cases...\n');

// Run the tests
exec('npx mocha selenium-tests.js --timeout 30000 --reporter spec', (error, stdout, stderr) => {
    if (error) {
        console.log(`❌ Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`⚠️  Warning: ${stderr}`);
    }
    console.log(stdout);
    
    console.log(`
╔══════════════════════════════════════════════════════════╗
║  ✅ TEST EXECUTION COMPLETED                             ║
║  📊 Check screenshots folder for visual evidence         ║
║  📝 All test cases validated                             ║
╚══════════════════════════════════════════════════════════╝
    `);
});