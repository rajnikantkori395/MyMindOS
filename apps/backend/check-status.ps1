# Quick Backend Status Check Script
# Usage: .\check-status.ps1

Write-Host "`n🔍 Checking MyMindOS Backend Status...`n" -ForegroundColor Cyan

# Check if process is running
$nodeProcess = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcess) {
    Write-Host "✅ Node.js process is running (PID: $($nodeProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js process not found" -ForegroundColor Red
}

# Check if port is listening
$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    Write-Host "✅ Port 3000 is listening" -ForegroundColor Green
} else {
    Write-Host "❌ Port 3000 is not listening" -ForegroundColor Red
}

# Check health endpoint
Write-Host "`n📡 Checking Health Endpoint...`n" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri http://localhost:3000/api/health -TimeoutSec 3 -UseBasicParsing
    $health = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Backend is RUNNING!`n" -ForegroundColor Green
    Write-Host "Status: $($health.status)" -ForegroundColor $(if ($health.status -eq 'ok') { 'Green' } else { 'Yellow' })
    Write-Host "Service: $($health.service)"
    Write-Host "Environment: $($health.environment)"
    Write-Host "Port: $($health.port)"
    Write-Host "Uptime: $([math]::Round($health.uptime, 2)) seconds"
    
    Write-Host "`n📊 Database Status:" -ForegroundColor Cyan
    $dbStatus = $health.database.status
    $dbColor = if ($dbStatus -eq 'connected') { 'Green' } else { 'Red' }
    Write-Host "  Status: $dbStatus" -ForegroundColor $dbColor
    Write-Host "  Database: $($health.database.name)"
    Write-Host "  Host: $($health.database.host)"
    Write-Host "  Port: $($health.database.port)"
    Write-Host "  ReadyState: $($health.database.readyState)"
    
    if ($health.database.readyState -ne 1) {
        Write-Host "`n⚠️  Database is not connected!" -ForegroundColor Yellow
        Write-Host "   Check your MONGO_URI in .env file" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Backend is NOT responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Try starting the backend:" -ForegroundColor Yellow
    Write-Host "   pnpm run dev:backend" -ForegroundColor Yellow
}

# Check Swagger
Write-Host "`n📚 Checking Swagger UI...`n" -ForegroundColor Cyan
try {
    $swaggerCheck = Invoke-WebRequest -Uri http://localhost:3000/api/docs -TimeoutSec 2 -UseBasicParsing
    Write-Host "✅ Swagger UI is accessible" -ForegroundColor Green
    Write-Host "   URL: http://localhost:3000/api/docs" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Swagger UI not accessible" -ForegroundColor Red
}

Write-Host "`n" -ForegroundColor Cyan

