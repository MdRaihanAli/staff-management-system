# Script to update frontend on Netlify
Write-Host "🚀 Updating Frontend on Netlify..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

# Deploy to Netlify
Write-Host "🌐 Deploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=dist

Write-Host "✅ Frontend update complete!" -ForegroundColor Green
Write-Host "🔗 Your site: https://fanciful-cendol-4eb10b.netlify.app" -ForegroundColor Cyan
