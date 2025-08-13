# 🚀 Render Deployment Guide for Staff Management API

## Why Render?
- ✅ **Free tier available** (no credit card required)
- ✅ **Automatic HTTPS** with custom domains
- ✅ **Auto-deploy** from GitHub
- ✅ **Excellent performance** and reliability
- ✅ **Easy environment management**
- ✅ **Built-in health checks**

---

## 📋 **Quick Deployment Steps**

### Step 1: Prepare Your Repository
Your server is already configured for Render! All necessary files are ready.

### Step 2: Deploy to Render

#### Option A: **Using Render Dashboard** (Recommended)

1. **Sign up** at https://render.com (free account)

2. **Connect GitHub:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub account
   - Select your `staff-management-system` repository

3. **Configure Service:**
   ```
   Name: staff-management-api
   Region: Oregon (US West) - or your preferred region
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: node server-new.js
   Auto-Deploy: Yes
   ```

4. **Set Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0
   DATABASE_NAME = staff_management
   NODE_ENV = production
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)

#### Option B: **Using Render CLI**

1. **Install Render CLI:**
   ```bash
   npm install -g @render/cli
   ```

2. **Login:**
   ```bash
   render login
   ```

3. **Deploy:**
   ```bash
   cd server
   render deploy
   ```

---

## 🧪 **Test Your Deployment**

After deployment, your API will be available at:
```
https://your-service-name.onrender.com
```

**Test these endpoints:**
- `GET /` - Root endpoint (service info)
- `GET /api/health` - Health check
- `GET /api/staff` - Staff data
- `GET /api/vacations` - Vacation data

**Example test:**
```bash
curl https://your-service-name.onrender.com/api/health
```

---

## ⚙️ **Environment Variables Required**

In Render dashboard, add these environment variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0` |
| `DATABASE_NAME` | `staff_management` |
| `NODE_ENV` | `production` |

---

## 🔧 **Configuration Files Included**

- ✅ `render.json` - Render service configuration
- ✅ `Dockerfile` - Container configuration (if needed)
- ✅ Root endpoint (`/`) for service verification
- ✅ Health check endpoint (`/api/health`)
- ✅ Production-ready CORS settings
- ✅ Error handling and logging

---

## 📱 **Update Your Frontend**

After deployment, update your frontend API configuration:

In `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

---

## 🔍 **Monitoring & Logs**

- **View logs:** Go to Render dashboard → Your service → Logs
- **Monitor health:** Automatic health checks on `/api/health`
- **Performance:** Built-in metrics in Render dashboard

---

## 🚨 **Troubleshooting**

### Common Issues:

1. **Build fails:**
   - Check if `package.json` exists in server folder
   - Verify Node.js version compatibility

2. **Health check fails:**
   - Ensure MongoDB connection string is correct
   - Check environment variables are set

3. **CORS errors:**
   - Add your frontend URL to allowed origins
   - Set `FRONTEND_URL` environment variable

4. **MongoDB connection issues:**
   - Verify MongoDB Atlas allows connections from 0.0.0.0/0
   - Check connection string format

### **Getting Help:**
- Check Render logs for detailed error messages
- Verify environment variables are set correctly
- Test API endpoints individually
- Check MongoDB Atlas network access settings

---

## 💡 **Pro Tips**

- **Free tier limitations:** Service sleeps after 15 minutes of inactivity
- **Keep warm:** Use a service like UptimeRobot to ping your API
- **Custom domain:** Available on paid plans
- **Auto-deploy:** Pushes to `main` branch auto-deploy
- **Scaling:** Easy to upgrade to paid plans for better performance

---

## 🎉 **Your API is Ready!**

Once deployed, your Staff Management API will be available 24/7 with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Health monitoring
- ✅ Auto-scaling
- ✅ Zero-downtime deployments
