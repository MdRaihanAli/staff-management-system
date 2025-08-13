#!/bin/bash

# Render Deployment Script for Staff Management API

echo "🚀 Preparing for Render deployment..."

# Check if we're in the server directory
if [ ! -f "server-new.js" ]; then
    echo "❌ Please run this script from the server directory"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in server directory"
    exit 1
fi

echo "✅ Server files verified"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
else
    echo "✅ Git repository found"
fi

echo ""
echo "🌐 Your server is ready for Render deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com and sign up"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: node server-new.js"
echo ""
echo "5. Set environment variables:"
echo "   - MONGODB_URI=mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0"
echo "   - DATABASE_NAME=staff_management"
echo "   - NODE_ENV=production"
echo ""
echo "6. Click 'Create Web Service'"
echo ""
echo "🔗 Your API will be available at: https://your-service-name.onrender.com"
echo "📚 Full guide: Read RENDER-DEPLOYMENT.md"
