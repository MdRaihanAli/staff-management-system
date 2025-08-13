# Render Deployment Script (PowerShell)

Write-Host "🚀 Deploying to Render..." -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "server\server-new.js")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Expected path: C:\Users\User\Desktop\New folder (2)\staff_management" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Blue
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    
    Write-Host "🔗 Please set up GitHub remote:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/MdRaihanAli/staff-management-system.git" -ForegroundColor Cyan
    Write-Host "git branch -M main" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again to deploy." -ForegroundColor Yellow
    exit 0
}

# Add and commit changes
Write-Host "📦 Adding and committing changes..." -ForegroundColor Blue
git add .

$commitMessage = "Deploy to Render: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

# Check if remote exists
$remoteExists = git remote -v 2>$null
if ([string]::IsNullOrEmpty($remoteExists)) {
    Write-Host "⚠️ No git remote found. Please add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/MdRaihanAli/staff-management-system.git" -ForegroundColor Cyan
    exit 1
}

# Push to GitHub (triggers auto-deploy on Render)
Write-Host "🔄 Pushing to GitHub..." -ForegroundColor Blue
git push origin main

Write-Host ""
Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host "🌐 Render will automatically deploy your changes" -ForegroundColor Cyan
Write-Host "📊 Check deployment status at: https://dashboard.render.com" -ForegroundColor Yellow
Write-Host "🔗 Your API will be available at: https://your-service-name.onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test endpoints after deployment:" -ForegroundColor Yellow
Write-Host "• GET / - Service info" -ForegroundColor Gray
Write-Host "• GET /api/health - Health check" -ForegroundColor Gray
Write-Host "• GET /api/staff - Staff data" -ForegroundColor Gray
Write-Host "• GET /api/vacations - Vacation data" -ForegroundColor Gray
