const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function headlessSafeTest() {
    console.log('\n🚀 Starting Automation Tests...\n');
    
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    let passed = 0;
    let failed = 0;

    try {
        console.log('Test 1: Loading Page');
        await driver.get('http://localhost:5000');
        await driver.sleep(2000);
        console.log('✅ PASSED: Page loaded\n');
        passed++;

        console.log('Test 2: Name Field');
        const nameField = await driver.findElement(By.id('fullName'));
        await nameField.clear();
        await nameField.sendKeys('Test User');
        console.log('✅ PASSED: Name filled\n');
        passed++;

        console.log('Test 3: Email Field');
        const emailField = await driver.findElement(By.id('email'));
        await emailField.clear();
        await emailField.sendKeys('test@example.com');
        console.log('✅ PASSED: Email filled\n');
        passed++;

        console.log('Test 4: Mobile Field');
        const mobileField = await driver.findElement(By.id('mobile'));
        await mobileField.clear();
        await mobileField.sendKeys('9876543210');
        console.log('✅ PASSED: Mobile filled\n');
        passed++;

        console.log('Test 5: Amount Field');
        const amountField = await driver.findElement(By.id('amount'));
        await amountField.clear();
        await amountField.sendKeys('1000');
        console.log('✅ PASSED: Amount entered\n');
        passed++;

        console.log('Test 6: UPI ID Field');
        const upiField = await driver.findElement(By.id('upiId'));
        await upiField.clear();
        await upiField.sendKeys('test@okhdfcbank');
        console.log('✅ PASSED: UPI ID entered\n');
        passed++;

        console.log('Test 7: Click Pay Button');
        const payBtn = await driver.findElement(By.id('payNowBtn'));
        await payBtn.click();
        console.log('✅ PASSED: Payment initiated\n');
        passed++;

        await driver.sleep(3000);

    } catch (error) {
        console.error('❌ FAILED:', error.message);
        failed++;
    } finally {
        await driver.quit();
    }

    console.log('\n========================================');
    console.log('TEST REPORT');
    console.log('========================================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed/(passed+failed))*100).toFixed(2)}%`);
    console.log('========================================\n');
}

headlessSafeTest().catch(console.error);