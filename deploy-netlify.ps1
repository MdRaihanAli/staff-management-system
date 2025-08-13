# Netlify Deployment Script (PowerShell)

Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "src\services\api.ts")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check if Netlify CLI is installed
try {
    netlify --version | Out-Null
    Write-Host "✅ Netlify CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g netlify-cli" -ForegroundColor Yellow
    exit 1
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix any errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Login to Netlify (if needed)
Write-Host "🔐 Checking Netlify authentication..." -ForegroundColor Blue
$authStatus = netlify status 2>&1 | Out-String
if ($authStatus -like "*Not logged in*") {
    Write-Host "⚠️ Please log in to Netlify..." -ForegroundColor Yellow
    netlify login
}

# Deploy to Netlify
Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Blue
netlify deploy --prod --dir=dist

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Note your Netlify URL from the output above" -ForegroundColor White
    Write-Host "2. Add it to your backend CORS settings on Render" -ForegroundColor White
    Write-Host "3. Set FRONTEND_URL environment variable on Render" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Test your application:" -ForegroundColor Cyan
    Write-Host "• Open your Netlify URL" -ForegroundColor Gray
    Write-Host "• Try loading staff data" -ForegroundColor Gray
    Write-Host "• Check for any CORS errors in browser console" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔗 Your Staff Management System is now live!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
}
