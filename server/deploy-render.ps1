# Render Deployment Script for Staff Management API (PowerShell)

Write-Host "🚀 Preparing for Render deployment..." -ForegroundColor Green

# Check if we're in the server directory
if (!(Test-Path "server-new.js")) {
    Write-Host "❌ Please run this script from the server directory" -ForegroundColor Red
    exit 1
}

# Check if package.json exists
if (!(Test-Path "package.json")) {
    Write-Host "❌ package.json not found in server directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Server files verified" -ForegroundColor Green

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Blue
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
} else {
    Write-Host "✅ Git repository found" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 Your server is ready for Render deployment!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://render.com and sign up" -ForegroundColor White
Write-Host "2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "3. Connect your GitHub repository" -ForegroundColor White
Write-Host "4. Use these settings:" -ForegroundColor White
Write-Host "   - Root Directory: server" -ForegroundColor Gray
Write-Host "   - Build Command: npm install" -ForegroundColor Gray
Write-Host "   - Start Command: node server-new.js" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Set environment variables:" -ForegroundColor White
Write-Host "   - MONGODB_URI=mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0" -ForegroundColor Gray
Write-Host "   - DATABASE_NAME=staff_management" -ForegroundColor Gray
Write-Host "   - NODE_ENV=production" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Click 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Your API will be available at: https://your-service-name.onrender.com" -ForegroundColor Cyan
Write-Host "📚 Full guide: Read RENDER-DEPLOYMENT.md" -ForegroundColor Yellow
