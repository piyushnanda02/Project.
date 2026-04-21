const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TIMEOUT = 10000;

async function runTests() {
    console.log('\n🚀 Starting Selenium Tests...\n');
    
    // Configure Chrome options
    const options = new chrome.Options();
    options.addArguments('--start-maximized');
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    let passedTests = 0;
    let failedTests = 0;
    const testResults = [];

    try {
        // Test 1: Load Page
        console.log('📋 TEST 1: Loading Payment Page');
        await driver.get(BASE_URL);
        await driver.sleep(2000);
        const title = await driver.getTitle();
        console.log(`   Page title: ${title}`);
        console.log('   ✅ PASSED: Page loaded successfully\n');
        passedTests++;
        testResults.push({ name: 'Page Load', status: 'PASSED' });

        // Test 2: Fill Name
        console.log('📋 TEST 2: Valid Name Input');
        const nameField = await driver.findElement(By.id('fullName'));
        await nameField.clear();
        await nameField.sendKeys('Rahul Sharma');
        const nameValue = await nameField.getAttribute('value');
        assert.strictEqual(nameValue, 'Rahul Sharma');
        console.log('   ✅ PASSED: Name accepted\n');
        passedTests++;
        testResults.push({ name: 'Name Validation', status: 'PASSED' });

        // Test 3: Fill Email
        console.log('📋 TEST 3: Valid Email Input');
        const emailField = await driver.findElement(By.id('email'));
        await emailField.clear();
        await emailField.sendKeys('rahul@example.com');
        const emailValue = await emailField.getAttribute('value');
        assert(emailValue.includes('@'));
        console.log('   ✅ PASSED: Email accepted\n');
        passedTests++;
        testResults.push({ name: 'Email Validation', status: 'PASSED' });

        // Test 4: Fill Mobile
        console.log('📋 TEST 4: Valid Mobile Number');
        const mobileField = await driver.findElement(By.id('mobile'));
        await mobileField.clear();
        await mobileField.sendKeys('9876543210');
        const mobileValue = await mobileField.getAttribute('value');
        assert(mobileValue.length >= 10);
        console.log('   ✅ PASSED: Mobile number accepted\n');
        passedTests++;
        testResults.push({ name: 'Mobile Validation', status: 'PASSED' });

        // Test 5: Amount Input
        console.log('📋 TEST 5: Valid Amount Input');
        const amountField = await driver.findElement(By.id('amount'));
        await amountField.clear();
        await amountField.sendKeys('5000');
        const amountValue = await amountField.getAttribute('value');
        assert.strictEqual(amountValue, '5000');
        console.log('   ✅ PASSED: Amount accepted\n');
        passedTests++;
        testResults.push({ name: 'Amount Input', status: 'PASSED' });

        // Test 6: GST Calculation
        console.log('📋 TEST 6: GST Calculation');
        await driver.sleep(1000);
        const gstElement = await driver.findElement(By.id('displayGST'));
        const gstText = await gstElement.getText();
        const gstAmount = parseInt(gstText.replace(/[^0-9]/g, ''));
        assert(gstAmount === 900 || gstAmount === 900); // 18% of 5000 = 900
        console.log(`   GST Amount: ₹${gstAmount}`);
        console.log('   ✅ PASSED: GST calculated correctly\n');
        passedTests++;
        testResults.push({ name: 'GST Calculation', status: 'PASSED' });

        // Test 7: Valid UPI ID
        console.log('📋 TEST 7: Valid UPI ID Format');
        const upiField = await driver.findElement(By.id('upiId'));
        await upiField.clear();
        await upiField.sendKeys('user@okhdfcbank');
        const upiValue = await upiField.getAttribute('value');
        assert(upiValue.includes('@'));
        console.log('   ✅ PASSED: UPI ID accepted\n');
        passedTests++;
        testResults.push({ name: 'UPI ID Validation', status: 'PASSED' });

        // Test 8: Empty Name Validation
        console.log('📋 TEST 8: Empty Name Validation');
        await nameField.clear();
        await nameField.sendKeys('');
        const payBtn = await driver.findElement(By.id('payNowBtn'));
        await payBtn.click();
        await driver.sleep(2000);
        const errorMsg = await driver.findElement(By.className('status-msg'));
        const errorText = await errorMsg.getText();
        assert(errorText.includes('Please enter your name'));
        console.log('   Error message shown correctly');
        console.log('   ✅ PASSED: Empty name handled\n');
        passedTests++;
        testResults.push({ name: 'Empty Name Validation', status: 'PASSED' });

        // Test 9: Invalid UPI ID
        console.log('📋 TEST 9: Invalid UPI ID (no @ symbol)');
        await nameField.clear();
        await nameField.sendKeys('Test User');
        await upiField.clear();
        await upiField.sendKeys('invalidupi');
        await payBtn.click();
        await driver.sleep(2000);
        const upiError = await driver.findElement(By.className('status-msg'));
        const upiErrorText = await upiError.getText();
        assert(upiErrorText.includes('valid UPI ID'));
        console.log('   Error message shown correctly');
        console.log('   ✅ PASSED: Invalid UPI ID rejected\n');
        passedTests++;
        testResults.push({ name: 'Invalid UPI ID', status: 'PASSED' });

        // Test 10: Payment Method Switching - Card
        console.log('📋 TEST 10: Switch to Card Payment');
        const cardMethod = await driver.findElement(By.css('[data-method="card"]'));
        await cardMethod.click();
        await driver.sleep(1000);
        const cardSection = await driver.findElement(By.id('cardSection'));
        const isCardVisible = await cardSection.isDisplayed();
        assert(isCardVisible === true);
        console.log('   ✅ PASSED: Card method selected\n');
        passedTests++;
        testResults.push({ name: 'Card Method Switch', status: 'PASSED' });

        // Test 11: Payment Method Switching - Net Banking
        console.log('📋 TEST 11: Switch to Net Banking');
        const netbankMethod = await driver.findElement(By.css('[data-method="netbank"]'));
        await netbankMethod.click();
        await driver.sleep(1000);
        const netbankSection = await driver.findElement(By.id('netbankSection'));
        const isNetbankVisible = await netbankSection.isDisplayed();
        assert(isNetbankVisible === true);
        console.log('   ✅ PASSED: Net Banking method selected\n');
        passedTests++;
        testResults.push({ name: 'NetBank Method Switch', status: 'PASSED' });

        // Test 12: Switch Back to UPI
        console.log('📋 TEST 12: Switch Back to UPI');
        const upiMethod = await driver.findElement(By.css('[data-method="upi"]'));
        await upiMethod.click();
        await driver.sleep(1000);
        const upiSection = await driver.findElement(By.id('upiSection'));
        const isUpiVisible = await upiSection.isDisplayed();
        assert(isUpiVisible === true);
        console.log('   ✅ PASSED: UPI method selected\n');
        passedTests++;
        testResults.push({ name: 'UPI Method Switch', status: 'PASSED' });

        // Test 13: Quick Amount Button
        console.log('📋 TEST 13: Quick Amount Button');
        const quickAmounts = await driver.findElements(By.className('quick-amount'));
        if (quickAmounts.length > 0) {
            await quickAmounts[2].click(); // Click 5000 button
            await driver.sleep(500);
            const amountValue2 = await amountField.getAttribute('value');
            assert(amountValue2 === '5000');
            console.log('   ✅ PASSED: Quick amount button works\n');
            passedTests++;
            testResults.push({ name: 'Quick Amount Button', status: 'PASSED' });
        }

        // Test 14: Successful Payment Initiation
        console.log('📋 TEST 14: Payment Initiation');
        await nameField.clear();
        await nameField.sendKeys('Payment Test User');
        await upiField.clear();
        await upiField.sendKeys('test@paytm');
        await amountField.clear();
        await amountField.sendKeys('100');
        await payBtn.click();
        await driver.sleep(3000);
        const statusMsg = await driver.findElement(By.className('status-msg'));
        const statusText = await statusMsg.getText();
        assert(statusText.includes('initiated') || statusText.includes('Processing'));
        console.log('   ✅ PASSED: Payment initiated\n');
        passedTests++;
        testResults.push({ name: 'Payment Initiation', status: 'PASSED' });

        // Test 15: Timer Display
        console.log('📋 TEST 15: Timer Display During Payment');
        const timerArea = await driver.findElement(By.id('timerArea'));
        const isTimerVisible = await timerArea.isDisplayed();
        assert(isTimerVisible === true);
        console.log('   ✅ PASSED: Timer displayed\n');
        passedTests++;
        testResults.push({ name: 'Timer Display', status: 'PASSED' });

        // Wait for payment to complete
        console.log('⏳ Waiting for payment to complete...');
        await driver.sleep(5000);

    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        failedTests++;
        testResults.push({ name: 'Test Execution', status: 'FAILED', error: error.message });
        
        // Take screenshot on failure
        try {
            const screenshot = await driver.takeScreenshot();
            const fs = require('fs');
            fs.writeFileSync(`./screenshot-error-${Date.now()}.png`, screenshot);
            console.log('📸 Screenshot saved');
        } catch(e) {}
    } finally {
        await driver.quit();
    }

    // Print Test Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST EXECUTION REPORT');
    console.log('='.repeat(60));
    console.log(`\n✅ PASSED TESTS: ${passedTests}`);
    console.log(`❌ FAILED TESTS: ${failedTests}`);
    console.log(`📈 SUCCESS RATE: ${((passedTests/(passedTests+failedTests))*100).toFixed(2)}%\n`);
    
    console.log('📋 DETAILED RESULTS:');
    console.log('-'.repeat(60));
    testResults.forEach(result => {
        const statusSymbol = result.status === 'PASSED' ? '✅' : '❌';
        console.log(`${statusSymbol} ${result.name}: ${result.status}`);
        if (result.error) console.log(`   Error: ${result.error}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 TEST EXECUTION COMPLETED');
    console.log('='.repeat(60) + '\n');
}

// Run the tests
runTests().catch(console.error);