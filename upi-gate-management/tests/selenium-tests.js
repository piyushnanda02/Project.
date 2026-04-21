const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');

// Configure Chrome options
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--start-maximized');
chromeOptions.addArguments('--disable-dev-shm-usage');

// Test Configuration
const BASE_URL = 'http://localhost:5000';
const TIMEOUT = 10000;

// Test Suite for UPI Payment Gateway
describe('UPI Payment Gateway - Automation Testing Suite', function() {
    this.timeout(30000); // Set timeout for all tests
    let driver;

    // Before all tests - Setup WebDriver
    before(async function() {
        console.log('🚀 Starting Selenium WebDriver...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();
        await driver.manage().setTimeouts({ implicit: TIMEOUT });
    });

    // After all tests - Close browser
    after(async function() {
        console.log('✅ Closing WebDriver...');
        if (driver) {
            await driver.quit();
        }
    });

    // Helper function to take screenshot on failure
    async function takeScreenshot(testName) {
        const screenshot = await driver.takeScreenshot();
        const fs = require('fs');
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        fs.writeFileSync(`./screenshots/${testName}_${timestamp}.png`, screenshot);
        console.log(`📸 Screenshot saved: ${testName}_${timestamp}.png`);
    }

    // ========== LOGIN MODULE TESTS ==========
    describe('1. LOGIN MODULE - User Information Validation', function() {
        
        it('TC-LOGIN-01: Should load the payment page successfully', async function() {
            await driver.get(BASE_URL);
            const title = await driver.getTitle();
            assert(title.includes('UPI Secure Gateway') || title.includes('PaySwift'));
            console.log('✅ Page loaded successfully');
        });

        it('TC-LOGIN-02: Should accept valid user name', async function() {
            const nameField = await driver.findElement(By.id('fullName'));
            await nameField.clear();
            await nameField.sendKeys('Rahul Sharma');
            const value = await nameField.getAttribute('value');
            assert.strictEqual(value, 'Rahul Sharma');
            console.log('✅ Valid name accepted');
        });

        it('TC-LOGIN-03: Should accept valid email format', async function() {
            const emailField = await driver.findElement(By.id('email'));
            await emailField.clear();
            await emailField.sendKeys('rahul@example.com');
            const value = await emailField.getAttribute('value');
            assert(value.includes('@') && value.includes('.'));
            console.log('✅ Valid email accepted');
        });

        it('TC-LOGIN-04: Should accept valid mobile number', async function() {
            const mobileField = await driver.findElement(By.id('mobile'));
            await mobileField.clear();
            await mobileField.sendKeys('+91 9876543210');
            const value = await mobileField.getAttribute('value');
            assert(value.length >= 10);
            console.log('✅ Valid mobile number accepted');
        });

        it('TC-LOGIN-05: Should show error for empty name', async function() {
            const nameField = await driver.findElement(By.id('fullName'));
            await nameField.clear();
            await nameField.sendKeys('');
            
            const payBtn = await driver.findElement(By.id('payNowBtn'));
            await payBtn.click();
            
            // Wait for error message
            const errorMsg = await driver.wait(
                until.elementLocated(By.className('status-msg')),
                TIMEOUT
            );
            const errorText = await errorMsg.getText();
            assert(errorText.includes('Please enter your name'));
            console.log('✅ Empty name validation works');
        });

        it('TC-LOGIN-06: Should update user hint dynamically', async function() {
            const nameField = await driver.findElement(By.id('fullName'));
            await nameField.clear();
            await nameField.sendKeys('Test User');
            
            const userHint = await driver.findElement(By.id('dynamicUserHint'));
            const hintText = await userHint.getText();
            assert(hintText.includes('Test User'));
            console.log('✅ Dynamic user hint updates correctly');
        });
    });

    // ========== CORE MODULE - AMOUNT HANDLING ==========
    describe('2. CORE MODULE - Amount Input and Calculations', function() {
        
        it('TC-AMOUNT-01: Should accept valid amount', async function() {
            const amountField = await driver.findElement(By.id('amount'));
            await amountField.clear();
            await amountField.sendKeys('5000');
            const value = await amountField.getAttribute('value');
            assert.strictEqual(value, '5000');
            console.log('✅ Valid amount accepted');
        });

        it('TC-AMOUNT-02: Should calculate GST correctly (18%)', async function() {
            await driver.findElement(By.id('amount')).clear();
            await driver.findElement(By.id('amount')).sendKeys('1000');
            
            // Wait for GST calculation
            await driver.sleep(1000);
            const gstElement = await driver.findElement(By.id('displayGST'));
            const gstText = await gstElement.getText();
            const gstAmount = parseInt(gstText.replace('₹', '').replace(',', ''));
            assert.strictEqual(gstAmount, 180); // 18% of 1000
            console.log('✅ GST calculation correct');
        });

        it('TC-AMOUNT-03: Should update total amount dynamically', async function() {
            await driver.findElement(By.id('amount')).clear();
            await driver.findElement(By.id('amount')).sendKeys('2000');
            await driver.sleep(500);
            
            const totalElement = await driver.findElement(By.id('totalAmount'));
            const totalText = await totalElement.getText();
            const total = parseInt(totalText.replace(/[^0-9]/g, ''));
            assert.strictEqual(total, 2360); // 2000 + 360 GST
            console.log('✅ Total amount updates dynamically');
        });

        it('TC-AMOUNT-04: Should handle quick amount buttons', async function() {
            const quickAmounts = await driver.findElements(By.className('quick-amount'));
            if (quickAmounts.length > 0) {
                await quickAmounts[2].click(); // Click on 5000 button
                await driver.sleep(500);
                const amountField = await driver.findElement(By.id('amount'));
                const value = await amountField.getAttribute('value');
                assert.strictEqual(value, '5000');
                console.log('✅ Quick amount buttons work');
            }
        });
    });

    // ========== CORE MODULE - UPI VALIDATION ==========
    describe('3. CORE MODULE - UPI ID Validation', function() {
        
        it('TC-UPI-01: Should accept valid UPI ID format', async function() {
            const upiField = await driver.findElement(By.id('upiId'));
            await upiField.clear();
            await upiField.sendKeys('user@okhdfcbank');
            const value = await upiField.getAttribute('value');
            assert(value.includes('@'));
            console.log('✅ Valid UPI ID accepted');
        });

        it('TC-UPI-02: Should reject UPI ID without @ symbol', async function() {
            const upiField = await driver.findElement(By.id('upiId'));
            await upiField.clear();
            await upiField.sendKeys('invalidupi');
            
            const payBtn = await driver.findElement(By.id('payNowBtn'));
            await payBtn.click();
            
            const errorMsg = await driver.wait(
                until.elementLocated(By.className('status-msg')),
                TIMEOUT
            );
            const errorText = await errorMsg.getText();
            assert(errorText.includes('valid UPI ID'));
            console.log('✅ Invalid UPI ID rejected');
        });

        it('TC-UPI-03: Should handle empty UPI ID', async function() {
            const upiField = await driver.findElement(By.id('upiId'));
            await upiField.clear();
            await upiField.sendKeys('');
            
            const payBtn = await driver.findElement(By.id('payNowBtn'));
            await payBtn.click();
            
            const errorMsg = await driver.wait(
                until.elementLocated(By.className('status-msg')),
                TIMEOUT
            );
            const errorText = await errorMsg.getText();
            assert(errorText.includes('Enter valid UPI ID'));
            console.log('✅ Empty UPI ID handled');
        });
    });

    // ========== CORE MODULE - PAYMENT PROCESSING ==========
    describe('4. CORE MODULE - Payment Processing', function() {
        
        it('TC-PAY-01: Should initiate payment with valid details', async function() {
            // Fill valid details
            await driver.findElement(By.id('fullName')).clear();
            await driver.findElement(By.id('fullName')).sendKeys('Test Payment User');
            await driver.findElement(By.id('email')).clear();
            await driver.findElement(By.id('email')).sendKeys('test@example.com');
            await driver.findElement(By.id('mobile')).clear();
            await driver.findElement(By.id('mobile')).sendKeys('9999999999');
            await driver.findElement(By.id('upiId')).clear();
            await driver.findElement(By.id('upiId')).sendKeys('test@paytm');
            await driver.findElement(By.id('amount')).clear();
            await driver.findElement(By.id('amount')).sendKeys('100');
            
            // Click pay button
            const payBtn = await driver.findElement(By.id('payNowBtn'));
            await payBtn.click();
            
            // Check for processing status
            const statusMsg = await driver.wait(
                until.elementLocated(By.className('status-msg')),
                TIMEOUT
            );
            const statusText = await statusMsg.getText();
            assert(statusText.includes('initiated') || statusText.includes('Processing'));
            console.log('✅ Payment initiated successfully');
        });

        it('TC-PAY-02: Should show timer during payment processing', async function() {
            const timerArea = await driver.findElement(By.id('timerArea'));
            const isDisplayed = await timerArea.isDisplayed();
            assert(isDisplayed === true);
            console.log('✅ Timer displayed during processing');
        });

        it('TC-PAY-03: Should disable pay button during processing', async function() {
            const payBtn = await driver.findElement(By.id('payNowBtn'));
            const isDisabled = await payBtn.getAttribute('disabled');
            assert(isDisabled === 'true');
            console.log('✅ Pay button disabled during processing');
        });
    });

    // ========== CORE MODULE - PAYMENT METHOD SWITCHING ==========
    describe('5. CORE MODULE - Payment Method Switching', function() {
        
        it('TC-METHOD-01: Should switch to Card payment method', async function() {
            const cardMethod = await driver.findElement(By.css('[data-method="card"]'));
            await cardMethod.click();
            await driver.sleep(500);
            
            const cardSection = await driver.findElement(By.id('cardSection'));
            const isVisible = await cardSection.isDisplayed();
            assert(isVisible === true);
            console.log('✅ Card payment method selected');
        });

        it('TC-METHOD-02: Should switch to Net Banking method', async function() {
            const netbankMethod = await driver.findElement(By.css('[data-method="netbank"]'));
            await netbankMethod.click();
            await driver.sleep(500);
            
            const netbankSection = await driver.findElement(By.id('netbankSection'));
            const isVisible = await netbankSection.isDisplayed();
            assert(isVisible === true);
            console.log('✅ Net Banking method selected');
        });

        it('TC-METHOD-03: Should switch back to UPI method', async function() {
            const upiMethod = await driver.findElement(By.css('[data-method="upi"]'));
            await upiMethod.click();
            await driver.sleep(500);
            
            const upiSection = await driver.findElement(By.id('upiSection'));
            const isVisible = await upiSection.isDisplayed();
            assert(isVisible === true);
            console.log('✅ UPI method selected');
        });
    });

    // ========== DATABASE VERIFICATION TESTS ==========
    describe('6. DATABASE MODULE - Transaction Storage', function() {
        
        it('TC-DB-01: Should verify transaction stored in database', async function() {
            // Make a test payment
            await driver.findElement(By.id('fullName')).clear();
            await driver.findElement(By.id('fullName')).sendKeys('DB Test User');
            await driver.findElement(By.id('amount')).clear();
            await driver.findElement(By.id('amount')).sendKeys('500');
            await driver.findElement(By.id('upiId')).clear();
            await driver.findElement(By.id('upiId')).sendKeys('dbtest@ybl');
            
            const payBtn = await driver.findElement(By.id('payNowBtn'));
            await payBtn.click();
            
            // Wait for completion
            await driver.sleep(5000);
            
            // Check transaction history
            const fetch = require('node-fetch');
            const response = await fetch(`${BASE_URL}/api/transactions`);
            const data = await response.json();
            
            assert(data.success === true);
            assert(data.transactions.length > 0);
            console.log('✅ Transactions stored in database');
        });
    });
});

// Additional Utility Functions for Test Report
async function generateTestReport() {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           TEST EXECUTION REPORT                          ║
╠══════════════════════════════════════════════════════════╣
║  Test Suite: UPI Payment Gateway Automation              ║
║  Tool: Selenium WebDriver                                ║
║  Browser: Chrome                                         ║
║  Base URL: ${BASE_URL}                                    ║
╠══════════════════════════════════════════════════════════╣
║  Modules Tested:                                         ║
║  ✅ Login Module - User Information Validation           ║
║  ✅ Core Module - Amount & GST Calculation               ║
║  ✅ Core Module - UPI ID Validation                      ║
║  ✅ Core Module - Payment Processing                     ║
║  ✅ Core Module - Payment Method Switching               ║
║  ✅ Database Module - Transaction Storage                ║
╚══════════════════════════════════════════════════════════╝
    `);
}

// Export for running
module.exports = { generateTestReport };