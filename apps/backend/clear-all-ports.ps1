# Clear All Development Ports
# Kills all processes on common development ports

Write-Host ""
Write-Host "Clearing development ports..." -ForegroundColor Cyan
Write-Host ""

$ports = @(3000, 4000, 3001, 8080, 5000)
$killed = 0

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Yellow
    
    # Get all connections on this port
    $netstatOutput = netstat -ano | Select-String ":$port "
    
    if ($netstatOutput) {
        foreach ($line in $netstatOutput) {
            # Extract PID from netstat output (last number)
            if ($line -match '\s+(\d+)\s*$') {
                $pid = $matches[1]
                
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "  Found: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        Write-Host "  Killed" -ForegroundColor Green
                        $killed++
                    }
                } catch {
                    # Process might have already terminated
                }
            }
        }
    } else {
        Write-Host "  Free" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Cleared $killed process(es). All ports are now free!" -ForegroundColor Cyan
Write-Host ""
