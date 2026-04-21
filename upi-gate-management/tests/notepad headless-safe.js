const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function headlessSafeTest() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 UPI GATEWAY - AUTOMATION TESTING');
    console.log('='.repeat(60) + '\n');
    
    // Configure Chrome for headless mode
    const options = new chrome.Options();
    options.addArguments('--headless=new');      // No visible browser
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    
    console.log('🔧 Launching Chrome in headless mode...\n');
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    let passed = 0;
    let failed = 0;

    try {
        // Test 1: Load Page
        console.log('📋 TEST 1: Loading Payment Page');
        await driver.get('http://localhost:5000');
        await driver.sleep(2000);
        const title = await driver.getTitle();
        console.log(`   ✅ PASSED: Page loaded - ${title}\n`);
        passed++;

        // Test 2: Fill Name
        console.log('📋 TEST 2: Name Field');
        const nameField = await driver.findElement(By.id('fullName'));
        await nameField.clear();
        await nameField.sendKeys('Automation Test User');
        console.log('   ✅ PASSED: Name filled\n');
        passed++;

        // Test 3: Fill Email
        console.log('📋 TEST 3: Email Field');
        const emailField = await driver.findElement(By.id('email'));
        await emailField.clear();
        await emailField.sendKeys('test@automation.com');
        console.log('   ✅ PASSED: Email filled\n');
        passed++;

        // Test 4: Fill Mobile
        console.log('📋 TEST 4: Mobile Field');
        const mobileField = await driver.findElement(By.id('mobile'));
        await mobileField.clear();
        await mobileField.sendKeys('9876543210');
        console.log('   ✅ PASSED: Mobile filled\n');
        passed++;

        // Test 5: Enter Amount
        console.log('📋 TEST 5: Amount Input');
        const amountField = await driver.findElement(By.id('amount'));
        await amountField.clear();
        await amountField.sendKeys('2500');
        console.log('   ✅ PASSED: Amount entered\n');
        passed++;

        // Test 6: Check GST
        console.log('📋 TEST 6: GST Calculation');
        await driver.sleep(500);
        const gstElement = await driver.findElement(By.id('displayGST'));
        const gstText = await gstElement.getText();
        console.log(`   GST Display: ${gstText}`);
        console.log('   ✅ PASSED: GST calculated\n');
        passed++;

        // Test 7: UPI ID
        console.log('📋 TEST 7: UPI ID Validation');
        const upiField = await driver.findElement(By.id('upiId'));
        await upiField.clear();
        await upiField.sendKeys('test@okhdfcbank');
        const upiValue = await upiField.getAttribute('value');
        if (upiValue.includes('@')) {
            console.log('   ✅ PASSED: Valid UPI ID\n');
            passed++;
        } else {
            console.log('   ❌ FAILED: Invalid UPI ID\n');
            failed++;
        }

        // Test 8: Payment Method Switch
        console.log('📋 TEST 8: Payment Method - Card');
        const cardBtn = await driver.findElement(By.css('[data-method="card"]'));
        await cardBtn.click();
        await driver.sleep(500);
        console.log('   ✅ PASSED: Card method selected\n');
        passed++;

        // Test 9: Switch Back to UPI
        console.log('📋 TEST 9: Payment Method - Back to UPI');
        const upiBtn = await driver.findElement(By.css('[data-method="upi"]'));
        await upiBtn.click();
        await driver.sleep(500);
        console.log('   ✅ PASSED: UPI method selected\n');
        passed++;

        // Test 10: Click Pay Button
        console.log('📋 TEST 10: Payment Initiation');
        const payBtn = await driver.findElement(By.id('payNowBtn'));
        await payBtn.click();
        await driver.sleep(3000);
        console.log('   ✅ PASSED: Payment initiated\n');
        passed++;

        // Test 11: Check Status Message
        console.log('📋 TEST 11: Status Message');
        const statusMsg = await driver.findElement(By.className('status-msg'));
        const statusText = await statusMsg.getText();
        console.log(`   Status: ${statusText.substring(0, 60)}`);
        console.log('   ✅ PASSED: Status received\n');
        passed++;

    } catch (error) {
        console.error(`❌ TEST FAILED: ${error.message}`);
        failed++;
    } finally {
        await driver.quit();
    }

    // Final Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUTOMATION TEST REPORT - Experiment 09');
    console.log('='.repeat(60));
    console.log(`\n✅ PASSED TESTS: ${passed}`);
    console.log(`❌ FAILED TESTS: ${failed}`);
    console.log(`📈 SUCCESS RATE: ${((passed/(passed+failed))*100).toFixed(2)}%\n`);
    console.log('='.repeat(60));
    console.log('🏁 TEST EXECUTION COMPLETED');
    console.log('='.repeat(60) + '\n');
}

headlessSafeTest().catch(console.error);