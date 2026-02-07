# Fix MongoDB URI Script
# This script will generate the correct MONGO_URI with URL-encoded password

Write-Host "`n🔧 Fixing MongoDB URI...`n" -ForegroundColor Cyan

$username = "rk_mongo_atlas"
$password = "Rk@261996"
$cluster = "cluster0.cmvlvjk.mongodb.net"
$database = "mymindos"

# URL encode the password
Add-Type -AssemblyName System.Web
$encodedPassword = [System.Web.HttpUtility]::UrlEncode($password)

# Build correct URI
$correctUri = "mongodb+srv://${username}:${encodedPassword}@${cluster}/${database}?retryWrites=true&w=majority"

Write-Host "✅ Corrected MONGO_URI:" -ForegroundColor Green
Write-Host $correctUri -ForegroundColor Yellow
Write-Host "`n📋 Copy this to your .env file:" -ForegroundColor Cyan
Write-Host "MONGO_URI=$correctUri" -ForegroundColor White

# Option to update .env automatically
$update = Read-Host "`nDo you want to update .env file automatically? (y/n)"
if ($update -eq 'y' -or $update -eq 'Y') {
    $envPath = ".\.env"
    if (Test-Path $envPath) {
        $content = Get-Content $envPath
        $newContent = $content | ForEach-Object {
            if ($_ -match "^MONGO_URI=") {
                "MONGO_URI=$correctUri"
            } else {
                $_
            }
        }
        Set-Content -Path $envPath -Value $newContent
        Write-Host "`n✅ .env file updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ .env file not found!" -ForegroundColor Red
    }
}

Write-Host "`n"

