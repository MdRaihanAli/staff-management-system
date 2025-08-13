# 🚀 Frontend Deployment Guide

Your backend server is deployed! Now let's deploy the frontend.

## 📋 **Next Steps for Frontend Deployment**

### **Step 1: Update API URL**

First, you need to replace the placeholder with your actual Render API URL:

1. **Get your Render API URL** from your Render dashboard
2. **Update the API configuration**:

**Option A: Using Environment Variable (Recommended)**
Update `.env.local`:
```
VITE_API_URL=https://your-actual-service-name.onrender.com/api
```

**Option B: Direct Update**
Edit `src/services/api.ts` and replace:
```typescript
return 'https://your-service-name.onrender.com/api';
```
With your actual URL:
```typescript
return 'https://staff-management-api-xyz.onrender.com/api';
```

---

## 🌐 **Frontend Deployment Options**

### **Option 1: Vercel (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   ```
   VITE_API_URL = https://your-render-api-url.onrender.com/api
   ```

### **Option 2: Netlify**

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### **Option 3: GitHub Pages**

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   "homepage": "https://MdRaihanAli.github.io/staff-management-system",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### **Option 4: Render (Same platform as backend)**

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Settings**:
   ```
   Name: staff-management-frontend
   Root Directory: (leave empty)
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

---

## ⚙️ **Update CORS Settings**

After deploying your frontend, update your backend's CORS settings:

1. **Add your frontend URL** to the server's allowed origins
2. **Set environment variable** on Render:
   ```
   FRONTEND_URL = https://your-frontend-url.vercel.app
   ```

---

## 🧪 **Test Full Stack Deployment**

After both deployments:

1. **Frontend**: `https://your-frontend-url.vercel.app`
2. **Backend**: `https://your-backend-url.onrender.com`

**Test the connection**:
- Open your frontend
- Try to load staff data
- Check browser console for any CORS errors

---

## 🔧 **Deployment Scripts**

I'll create deployment scripts for you:

### **For Vercel Deployment**:
```bash
# Update API URL first, then:
npm run build
vercel --prod
```

### **For Netlify Deployment**:
```bash
# Update API URL first, then:
npm run build
netlify deploy --prod --dir=dist
```

---

## 🆘 **Common Issues**

1. **CORS Errors**: Make sure to set FRONTEND_URL on your backend
2. **API Not Found**: Verify your API URL is correct
3. **Build Fails**: Check for TypeScript errors

**Your full-stack application will be live after frontend deployment!** 🎉
