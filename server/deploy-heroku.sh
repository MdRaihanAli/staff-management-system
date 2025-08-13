#!/bin/bash

# Heroku Deployment Script for Staff Management Server

echo "🚀 Starting Heroku deployment..."

# Check if heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   Download from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if we're in the server directory
if [ ! -f "server-new.js" ]; then
    echo "❌ Please run this script from the server directory"
    exit 1
fi

# Login to Heroku
echo "🔐 Logging into Heroku..."
heroku login

# Get app name from user
read -p "Enter your Heroku app name (e.g., my-staff-api): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name cannot be empty"
    exit 1
fi

# Create Heroku app
echo "📱 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

# Set environment variables
echo "⚙️ Setting environment variables..."
heroku config:set MONGODB_URI="mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0" -a $APP_NAME
heroku config:set DATABASE_NAME="staff_management" -a $APP_NAME
heroku config:set NODE_ENV="production" -a $APP_NAME

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add files and commit
echo "📝 Committing files..."
git add .
git commit -m "Deploy staff management server to Heroku"

# Add heroku remote
heroku git:remote -a $APP_NAME

# Deploy
echo "🚀 Deploying to Heroku..."
git push heroku main

echo "✅ Deployment complete!"
echo "🌐 Your API is available at: https://$APP_NAME.herokuapp.com"
echo "🔍 Test health endpoint: https://$APP_NAME.herokuapp.com/api/health"
echo "📊 View logs: heroku logs --tail -a $APP_NAME"
