// Check Selenium setup
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function checkSetup() {
    console.log('🔍 Checking Selenium Setup...\n');
    
    // Check if Chrome is available
    const { exec } = require('child_process');
    exec('where chrome', (error, stdout) => {
        if (error) {
            console.log('❌ Chrome browser not found in PATH');
            console.log('📝 Please install Chrome from: https://www.google.com/chrome/');
        } else {
            console.log('✅ Chrome found at:', stdout.trim());
        }
    });
    
    // Try to launch Chrome
    try {
        console.log('\n🚀 Attempting to launch Chrome...');
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        
        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('✅ Chrome launched successfully!');
        await driver.get('https://www.google.com');
        console.log('✅ Navigated to Google');
        await driver.sleep(2000);
        await driver.quit();
        console.log('✅ Test completed - Chrome works!');
        
    } catch(error) {
        console.log('❌ Failed to launch Chrome:', error.message);
        console.log('\n📋 Troubleshooting steps:');
        console.log('1. Install Chrome browser');
        console.log('2. Run: npm install chromedriver@latest');
        console.log('3. Restart your computer');
    }
}

checkSetup();