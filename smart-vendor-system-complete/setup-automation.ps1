Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setting up Automation Testing Framework" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

cd C:\Users\piyus\PROJECT\smart-vendor-system-complete

Write-Host "`n📁 Creating folder structure..." -ForegroundColor Yellow
mkdir automation-tests -Force
cd automation-tests

$folders = @(
    "src\main\java\com\vendor\config",
    "src\main\java\com\vendor\pages",
    "src\main\java\com\vendor\utils",
    "src\main\java\com\vendor\listeners",
    "src\test\java\com\vendor\testcases",
    "src\test\java\com\vendor\suite",
    "src\test\resources",
    "test-data",
    "screenshots",
    "reports",
    "logs",
    "drivers"
)

foreach ($folder in $folders) {
    New-Item -Path $folder -ItemType Directory -Force | Out-Null
    Write-Host "  ✅ Created: $folder"
}

Write-Host "`n✅ Folder structure created successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the pom.xml content to the file" -ForegroundColor White
Write-Host "2. Copy all Java class contents to respective files" -ForegroundColor White
Write-Host "3. Run: mvn clean install" -ForegroundColor White
Write-Host "4. Run: mvn test" -ForegroundColor White
