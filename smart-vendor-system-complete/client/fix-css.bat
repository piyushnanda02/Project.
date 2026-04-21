@echo off
echo 🔧 Fixing Missing CSS File
echo =========================

echo Creating index.css file...
echo @tailwind base; > src\index.css
echo @tailwind components; >> src\index.css
echo @tailwind utilities; >> src\index.css
echo. >> src\index.css
echo body { >> src\index.css
echo   margin: 0; >> src\index.css
echo   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', >> src\index.css
echo     'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', >> src\index.css
echo     sans-serif; >> src\index.css
echo   -webkit-font-smoothing: antialiased; >> src\index.css
echo   -moz-osx-font-smoothing: grayscale; >> src\index.css
echo } >> src\index.css

echo ✅ index.css created successfully!
echo.
echo Starting React app...
npm start