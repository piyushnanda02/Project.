const { Builder, By } = require('selenium-webdriver');

async function minimalTest() {
    console.log('🚀 Opening browser...');
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        console.log('📱 Navigating to http://localhost:5000');
        await driver.get('http://localhost:5000');
        await driver.sleep(2000);
        
        console.log('✅ Page loaded!');
        const title = await driver.getTitle();
        console.log(`📄 Page title: ${title}`);
        
        // Try to find name field
        const nameField = await driver.findElement(By.id('fullName'));
        await nameField.sendKeys('Test User');
        console.log('✅ Name field filled!');
        
        await driver.sleep(2000);
        console.log('🎉 Test completed successfully!');
        
    } catch(err) {
        console.error('❌ Error:', err.message);
    } finally {
        await driver.quit();
        console.log('🔒 Browser closed');
    }
}

minimalTest();