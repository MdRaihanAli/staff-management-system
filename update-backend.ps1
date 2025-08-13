# Script to update backend on Render
Write-Host "🚀 Updating Backend on Render..." -ForegroundColor Green

# Navigate to server directory
Set-Location server

# Add changes to git
Write-Host "📝 Adding changes to git..." -ForegroundColor Yellow
git add .

# Commit changes
$commitMessage = Read-Host "Enter commit message"
git commit -m "$commitMessage"

# Push to GitHub (this triggers Render auto-deploy)
Write-Host "🔄 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Backend update pushed!" -ForegroundColor Green
Write-Host "⏳ Render will auto-deploy in 2-3 minutes..." -ForegroundColor Yellow
Write-Host "🔗 Your API: https://staff-management-api-hzq0.onrender.com" -ForegroundColor Cyan
Write-Host "📊 Check deploy status: https://dashboard.render.com" -ForegroundColor Cyan

# Go back to main directory
Set-Location ..
