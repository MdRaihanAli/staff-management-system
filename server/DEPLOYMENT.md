# Staff Management Server Deployment Guide

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (already configured)
- Git repository

## Environment Variables Required
```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=staff_management
NODE_ENV=production
PORT=3000 (will be set automatically by hosting platform)
FRONTEND_URL=your_frontend_deployment_url (optional)
```

## Deployment Options

### 1. Heroku Deployment (Recommended)

#### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
cd server
heroku create your-app-name-api
```

#### Step 4: Set Environment Variables
```bash
heroku config:set MONGODB_URI="mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set DATABASE_NAME="staff_management"
heroku config:set NODE_ENV="production"
```

#### Step 5: Deploy
```bash
git init
git add .
git commit -m "Initial deployment"
heroku git:remote -a your-app-name-api
git push heroku main
```

### 2. Vercel Deployment

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Deploy
```bash
cd server
vercel
```

#### Step 3: Set Environment Variables in Vercel Dashboard
- Go to vercel.com → Your Project → Settings → Environment Variables
- Add: MONGODB_URI, DATABASE_NAME, NODE_ENV

### 3. Railway Deployment

#### Step 1: Go to railway.app
#### Step 2: Connect GitHub repository
#### Step 3: Deploy from server folder
#### Step 4: Set environment variables in Railway dashboard

### 4. DigitalOcean App Platform

#### Step 1: Go to cloud.digitalocean.com
#### Step 2: Create new App
#### Step 3: Connect GitHub repository
#### Step 4: Select server folder as source
#### Step 5: Set environment variables

## Testing Your Deployment

After deployment, test these endpoints:
- `GET /api/health` - Health check
- `GET /api/staff` - Get all staff
- `GET /api/vacations` - Get all vacations

## Frontend Configuration

After deploying the server, update your frontend's API configuration:

In `src/services/api.ts`, change:
```typescript
const API_BASE_URL = 'https://your-deployed-server-url.com/api';
```

## Common Issues

1. **CORS Errors**: Make sure to set FRONTEND_URL environment variable to your frontend deployment URL
2. **MongoDB Connection**: Verify MONGODB_URI is correct and database is accessible
3. **Port Issues**: Most platforms set PORT automatically, don't hardcode it

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas network access settings
