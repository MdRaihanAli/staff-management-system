# 🚀 Quick Server Deployment Guide

## Choose Your Hosting Platform:

### 🟢 **HEROKU** (Easiest - Recommended for beginners)
1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Run deployment script**:
   ```powershell
   cd server
   .\deploy-heroku.ps1
   ```
3. **Your API will be live at**: `https://your-app-name.herokuapp.com`

### 🔵 **VERCEL** (Great for full-stack)
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**:
   ```bash
   cd server
   vercel
   ```
3. **Set environment variables in Vercel dashboard**

### 🟠 **RAILWAY** (Modern alternative)
1. **Go to**: https://railway.app
2. **Connect your GitHub repository**
3. **Deploy from server folder**
4. **Set environment variables in dashboard**

### 🔴 **DIGITALOCEAN** (Professional)
1. **Go to**: https://cloud.digitalocean.com
2. **Create new App Platform app**
3. **Connect GitHub repository**
4. **Select server folder as source**

---

## 📋 Required Environment Variables:
```
MONGODB_URI=mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=staff_management
NODE_ENV=production
```

## 🧪 Test Your Deployment:
After deployment, visit these URLs:
- `https://your-domain.com/api/health` ✅ Health check
- `https://your-domain.com/api/staff` 👥 Staff data
- `https://your-domain.com/api/vacations` 🏖️ Vacation data

## 📱 Update Frontend:
In your frontend `src/services/api.ts`, change:
```typescript
const API_BASE_URL = 'https://your-deployed-url.com/api';
```

## 🆘 Need Help?
1. Check deployment logs
2. Verify environment variables
3. Test individual API endpoints
4. Read full guide in `DEPLOYMENT.md`
