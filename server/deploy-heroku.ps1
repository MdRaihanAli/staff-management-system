# Heroku Deployment Script for Staff Management Server (PowerShell)

Write-Host "🚀 Starting Heroku deployment..." -ForegroundColor Green

# Check if heroku CLI is installed
try {
    heroku --version | Out-Null
} catch {
    Write-Host "❌ Heroku CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   Download from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the server directory
if (!(Test-Path "server-new.js")) {
    Write-Host "❌ Please run this script from the server directory" -ForegroundColor Red
    exit 1
}

# Get app name from user
$APP_NAME = Read-Host "Enter your Heroku app name (e.g., my-staff-api)"

if ([string]::IsNullOrWhiteSpace($APP_NAME)) {
    Write-Host "❌ App name cannot be empty" -ForegroundColor Red
    exit 1
}

# Login to Heroku
Write-Host "🔐 Logging into Heroku..." -ForegroundColor Blue
heroku login

# Create Heroku app
Write-Host "📱 Creating Heroku app: $APP_NAME" -ForegroundColor Blue
heroku create $APP_NAME

# Set environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Blue
heroku config:set MONGODB_URI="mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0" -a $APP_NAME
heroku config:set DATABASE_NAME="staff_management" -a $APP_NAME
heroku config:set NODE_ENV="production" -a $APP_NAME

# Initialize git if not already initialized
if (!(Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Blue
    git init
}

# Add files and commit
Write-Host "📝 Committing files..." -ForegroundColor Blue
git add .
git commit -m "Deploy staff management server to Heroku"

# Add heroku remote
heroku git:remote -a $APP_NAME

# Deploy
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Blue
git push heroku main

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your API is available at: https://$APP_NAME.herokuapp.com" -ForegroundColor Cyan
Write-Host "🔍 Test health endpoint: https://$APP_NAME.herokuapp.com/api/health" -ForegroundColor Cyan
Write-Host "📊 View logs: heroku logs --tail -a $APP_NAME" -ForegroundColor Cyan
