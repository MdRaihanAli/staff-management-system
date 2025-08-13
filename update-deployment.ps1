# Complete deployment update script
Write-Host "🚀 Full Stack Update Process" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Ask what to update
$choice = Read-Host "What do you want to update? (1) Frontend only (2) Backend only (3) Both"

if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host "`n🌐 Updating Frontend..." -ForegroundColor Blue
    npm run build
    netlify deploy --prod --dir=dist
    Write-Host "✅ Frontend updated!" -ForegroundColor Green
}

if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host "`n🔧 Updating Backend..." -ForegroundColor Blue
    Set-Location server
    
    git add .
    $commitMessage = Read-Host "Enter commit message for backend changes"
    git commit -m "$commitMessage"
    git push origin main
    
    Set-Location ..
    Write-Host "✅ Backend updated!" -ForegroundColor Green
    Write-Host "⏳ Render will auto-deploy in 2-3 minutes..." -ForegroundColor Yellow
}

Write-Host "`n🎉 Update process complete!" -ForegroundColor Green
Write-Host "🔗 Frontend: https://fanciful-cendol-4eb10b.netlify.app" -ForegroundColor Cyan
Write-Host "🔗 Backend: https://staff-management-api-hzq0.onrender.com" -ForegroundColor Cyan
