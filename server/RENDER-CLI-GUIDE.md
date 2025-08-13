# 🚀 Deploy to Render - Complete Guide

## 📋 **Render Deployment Methods**

Render doesn't have a traditional CLI like Heroku, but here are the best ways to deploy:

---

## 🌐 **Method 1: Web Dashboard (Recommended)**

### **Step 1: Prepare Your Code**

First, let's make sure your code is committed to Git:

```bash
# Navigate to your project root
cd "C:\Users\User\Desktop\New folder (2)\staff_management"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Ready for Render deployment"

# Push to GitHub (if you haven't already)
git remote add origin https://github.com/MdRaihanAli/staff-management-system.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy via Render Dashboard**

1. **Go to**: https://render.com
2. **Sign up/Login** (free account)
3. **Click "New +"** → **"Web Service"**
4. **Connect GitHub** and select your repository
5. **Configure service**:

```
Name: staff-management-api
Region: Oregon (US West)
Branch: main
Root Directory: server          ← Important!
Runtime: Node
Build Command: npm install
Start Command: node server-new.js
```

6. **Set Environment Variables**:
```
MONGODB_URI = mongodb+srv://vs4:vs4@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME = staff_management
NODE_ENV = production
```

7. **Click "Create Web Service"**

---

## 🔧 **Method 2: Using Git Commands (Auto-Deploy)**

Once you've set up the service on Render, any push to your main branch will auto-deploy:

```bash
# Make changes to your code
# Then commit and push:

git add .
git commit -m "Update server for production"
git push origin main

# Render will automatically detect the push and redeploy!
```

---

## 📁 **Method 3: Using render.yaml (Infrastructure as Code)**

Create a `render.yaml` in your project root for automated deployments:

```yaml
# render.yaml
services:
  - type: web
    name: staff-management-api
    runtime: node
    rootDir: server
    buildCommand: npm install
    startCommand: node server-new.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_NAME
        value: staff_management
      - key: MONGODB_URI
        sync: false  # Set this in dashboard for security
```

---

## 🚀 **Quick Deployment Script**

Let me create a deployment script for you:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Preparing for Render deployment..."

# Check if we're in the right directory
if [ ! -f "server/server-new.js" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Add and commit changes
echo "📦 Committing changes..."
git add .
git commit -m "Deploy to Render: $(date)"

# Push to GitHub (triggers auto-deploy on Render)
echo "🔄 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo "🌐 Render will automatically deploy your changes"
echo "📊 Check deployment status at: https://dashboard.render.com"
echo "🔗 Your API will be available at: https://your-service-name.onrender.com"
```

---

## 🧪 **Test Your Deployment**

After deployment, test these endpoints:

```bash
# Replace 'your-service-name' with your actual service name
curl https://your-service-name.onrender.com/
curl https://your-service-name.onrender.com/api/health
curl https://your-service-name.onrender.com/api/staff
```

---

## 🔄 **Deployment Workflow**

### **For Updates:**
1. Make changes to your code
2. Commit: `git add . && git commit -m "Your update message"`
3. Push: `git push origin main`
4. Render auto-deploys within 2-3 minutes!

### **Monitor Deployment:**
- **Dashboard**: https://dashboard.render.com
- **Logs**: Available in your service dashboard
- **Health**: Automatic health checks on `/api/health`

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Build fails**: Check that `Root Directory` is set to `server`
2. **Health check fails**: Verify MongoDB connection and environment variables
3. **CORS errors**: Ensure environment variables are set correctly

### **View Logs:**
- Go to Render Dashboard → Your Service → Logs
- Real-time log streaming available

---

## 💡 **Pro Tips**

- ✅ **Free tier**: Your service sleeps after 15 minutes of inactivity
- ✅ **Keep warm**: Use UptimeRobot or similar to ping your API
- ✅ **Auto-deploy**: Enabled by default on main branch
- ✅ **Custom domains**: Available on paid plans
- ✅ **Environment variables**: Never commit secrets to Git

**Your API will be live in 2-3 minutes after setup!** 🎉
