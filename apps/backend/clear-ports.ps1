# Clear Ports Script
# Kills processes using common development ports

Write-Host "`n🔍 Checking for processes on common ports...`n" -ForegroundColor Cyan

$ports = @(3000, 4000, 3001, 8080, 5000)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Yellow
    
    # Find process using the port
    $connections = netstat -ano | Select-String ":$port\s"
    
    if ($connections) {
        $pids = $connections | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $matches[1]
            }
        } | Select-Object -Unique
        
        foreach ($pid in $pids) {
            if ($pid) {
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "  ⚠️  Port $port is in use by: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                        $kill = Read-Host "  Kill this process? (y/n)"
                        if ($kill -eq 'y' -or $kill -eq 'Y') {
                            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                            Write-Host "  ✅ Killed process $pid" -ForegroundColor Green
                        }
                    }
                } catch {
                    Write-Host "  ❌ Could not kill process $pid" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "  ✅ Port $port is free" -ForegroundColor Green
    }
}

Write-Host "`n✅ Port check complete!`n" -ForegroundColor Cyan

