@echo off
echo 🔧 Setting up React Frontend for Smart Vendor Ledger
echo ================================================
echo.

echo Step 1: Cleaning old installation...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)
echo ✅ Cleanup complete
echo.

echo Step 2: Installing core React packages...
call npm install react@18.2.0 react-dom@18.2.0
echo ✅ Core React installed
echo.

echo Step 3: Installing React Scripts...
call npm install react-scripts@5.0.1
echo ✅ React Scripts installed
echo.

echo Step 4: Installing routing and HTTP...
call npm install react-router-dom@6.8.0 axios@1.3.0
echo ✅ Routing installed
echo.

echo Step 5: Installing UI libraries...
call npm install lucide-react@0.263.1 framer-motion@10.12.0 recharts@2.5.0
echo ✅ UI libraries installed
echo.

echo Step 6: Verifying installation...
call npm list react-scripts
echo.

echo ✅ Setup Complete!
echo.
echo To start the app, run: npm start
pause