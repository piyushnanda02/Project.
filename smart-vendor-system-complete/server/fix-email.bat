@echo off
echo 🔧 Fixing Email Configuration
echo ============================
echo.

echo Step 1: Checking .env file...
if exist .env (
    echo ✅ .env file exists
    type .env | findstr EMAIL
) else (
    echo ❌ .env file not found
)

echo.
echo Step 2: Testing email configuration...
node test-otp.js

echo.
echo Step 3: If test fails, update your .env file with:
echo EMAIL_USER=piyushgamerindia@gmail.com
echo EMAIL_PASS=your-16-digit-app-password
echo.
echo Get app password from: https://myaccount.google.com/apppasswords

pause