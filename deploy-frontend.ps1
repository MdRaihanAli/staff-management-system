# Frontend Deployment Script (PowerShell)

Write-Host "🚀 Deploying Frontend to Vercel..." -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "src\services\api.ts")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Prompt for API URL
Write-Host ""
Write-Host "📝 Please provide your Render API URL:" -ForegroundColor Yellow
Write-Host "Example: https://staff-management-api-xyz.onrender.com/api" -ForegroundColor Gray
$apiUrl = Read-Host "Enter your API URL"

if ([string]::IsNullOrWhiteSpace($apiUrl)) {
    Write-Host "❌ API URL cannot be empty" -ForegroundColor Red
    exit 1
}

# Update .env.local file
Write-Host "⚙️ Updating environment configuration..." -ForegroundColor Blue
$envContent = "# Frontend Environment Variables for Vite`n`n# API URL`nVITE_API_URL=$apiUrl"
$envContent | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "✅ Environment configured with: $apiUrl" -ForegroundColor Green

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix any errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Note your frontend URL from Vercel" -ForegroundColor White
Write-Host "2. Add it to your backend CORS settings on Render" -ForegroundColor White
Write-Host "3. Set FRONTEND_URL environment variable on Render" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test your application:" -ForegroundColor Cyan
Write-Host "• Open your frontend URL" -ForegroundColor Gray
Write-Host "• Try loading staff data" -ForegroundColor Gray
Write-Host "• Check for any CORS errors in browser console" -ForegroundColor Gray
