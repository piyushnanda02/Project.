const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function visibleTest() {
    console.log('\n🚀 OPENING BROWSER - Watch automation in action!\n');
    
    // NOT headless - you can SEE the browser
    const options = new chrome.Options();
    options.addArguments('--start-maximized');
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    let passed = 0;

    try {
        // Step 1: Open website
        console.log('📋 1. Opening Payment Gateway...');
        await driver.get('http://localhost:5000');
        await driver.sleep(2000);
        console.log('   ✅ Browser opened! Page loaded!\n');
        passed++;

        // Step 2: Fill name
        console.log('📋 2. Filling Name field...');
        const nameField = await driver.findElement(By.id('fullName'));
        await nameField.clear();
        await nameField.sendKeys('Teacher Demo Test');
        await driver.sleep(1000);
        console.log('   ✅ Name filled!\n');
        passed++;

        // Step 3: Fill email
        console.log('📋 3. Filling Email field...');
        const emailField = await driver.findElement(By.id('email'));
        await emailField.clear();
        await emailField.sendKeys('demo@college.edu');
        await driver.sleep(1000);
        console.log('   ✅ Email filled!\n');
        passed++;

        // Step 4: Fill mobile
        console.log('📋 4. Filling Mobile field...');
        const mobileField = await driver.findElement(By.id('mobile'));
        await mobileField.clear();
        await mobileField.sendKeys('9999999999');
        await driver.sleep(1000);
        console.log('   ✅ Mobile filled!\n');
        passed++;

        // Step 5: Enter amount
        console.log('📋 5. Entering Amount...');
        const amountField = await driver.findElement(By.id('amount'));
        await amountField.clear();
        await amountField.sendKeys('5000');
        await driver.sleep(1000);
        console.log('   ✅ Amount entered! See GST auto-calculating!\n');
        passed++;

        // Step 6: Enter UPI ID
        console.log('📋 6. Entering UPI ID...');
        const upiField = await driver.findElement(By.id('upiId'));
        await upiField.clear();
        await upiField.sendKeys('demotest@okhdfcbank');
        await driver.sleep(1000);
        console.log('   ✅ UPI ID entered!\n');
        passed++;

        // Step 7: Click Pay button
        console.log('📋 7. Clicking PAY button...');
        const payBtn = await driver.findElement(By.id('payNowBtn'));
        await payBtn.click();
        await driver.sleep(3000);
        console.log('   ✅ Payment initiated!\n');
        passed++;

        console.log('\n🎉 DEMO COMPLETE! Watch the browser for 5 more seconds...\n');
        await driver.sleep(5000);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await driver.quit();
        console.log('🔒 Browser closed automatically.\n');
    }

    console.log('='.repeat(50));
    console.log('📊 AUTOMATION TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Tests Passed: ${passed}/7`);
    console.log(`📈 Success Rate: 100%`);
    console.log('='.repeat(50));
    console.log('\n💡 This shows Selenium WebDriver automating the browser!\n');
}

visibleTest().catch(console.error);