# Quick Kill Port Script
# Usage: .\kill-port.ps1 3000
# Or: .\kill-port.ps1 3000,4000

param(
    [Parameter(Mandatory=$true)]
    [string[]]$Ports
)

Write-Host "`n🔍 Killing processes on ports: $($Ports -join ', ')`n" -ForegroundColor Cyan

foreach ($port in $Ports) {
    Write-Host "Checking port $port..." -ForegroundColor Yellow
    
    # Find process using the port
    $connections = netstat -ano | Select-String ":$port\s"
444
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
                        Write-Host "  Killing: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        Write-Host "  ✅ Killed process $pid" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  ❌ Could not kill process $pid: $_" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "  ✅ Port $port is already free" -ForegroundColor Green
    }
}

Write-Host "`n✅ Done!`n" -ForegroundColor Cyan

