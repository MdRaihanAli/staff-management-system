# 🚀 Staff Management System - Complete Deployment Guide

**Project**: Staff Management System  
**Owner**: MdRaihanAli  
**Repository**: https://github.com/MdRaihanAli/staff-management-system  
**Created**: August 13, 2025  

## 📋 Project Overview

A full-stack staff management application with vacation tracking, built with React 19 + TypeScript + Vite frontend, Node.js + Express backend, and MongoDB Atlas database.

### **Live URLs**
- **Frontend (Netlify)**: https://fanciful-cendol-4eb10b.netlify.app
- **Backend (Render)**: https://staff-management-api-hzq0.onrender.com
- **Database**: MongoDB Atlas - cluster0.q8hlybw.mongodb.net/staff_management

### **Admin Dashboards**
- **Netlify Admin**: https://app.netlify.com/projects/fanciful-cendol-4eb10b
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com

## 🏗️ Architecture

```
Frontend (Netlify)
    ↓ HTTPS API calls
Backend (Render)
    ↓ MongoDB connection
Database (MongoDB Atlas)
```

### **Technology Stack**
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB driver
- **Database**: MongoDB Atlas (cloud)
- **Hosting**: Netlify (frontend) + Render (backend)

## 🔧 Environment Configuration

### **Frontend Environment Variables**
```bash
# In production (Netlify)
VITE_API_URL=https://staff-management-api-hzq0.onrender.com/api

# In development (local)
VITE_API_URL=http://localhost:3000/api
```

### **Backend Environment Variables (Render)**
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.q8hlybw.mongodb.net/staff_management?retryWrites=true&w=majority
DATABASE_NAME=staff_management
```

## 📁 Project Structure

```
staff_management/
├── src/                          # Frontend source
│   ├── components/              # React components
│   ├── services/api.ts         # API service (environment-aware)
│   ├── contexts/StaffContext.tsx
│   └── types/staff.ts
├── server/                      # Backend source
│   ├── server-new.js           # Main server file (production)
│   ├── package.json            # Server dependencies
│   └── .env                    # Environment variables
├── dist/                       # Built frontend (for deployment)
├── netlify.toml               # Netlify deployment config
├── deploy-netlify.ps1         # Frontend deployment script
├── update-frontend.ps1        # Frontend update script
├── update-backend.ps1         # Backend update script
└── update-deployment.ps1      # Complete update script
```

## 🚀 Deployment Process

### **Initial Setup (Already Done)**

1. **Frontend Setup**:
   - Built with `npm run build`
   - Deployed to Netlify using `netlify deploy --prod --dir=dist`
   - Configured with `netlify.toml`

2. **Backend Setup**:
   - Deployed to Render via GitHub integration
   - Auto-deploys on git push to main branch
   - CORS configured for Netlify frontend

3. **Database Setup**:
   - MongoDB Atlas cluster created
   - Vacation management fully integrated
   - Data persists across sessions

### **Update Workflows**

#### **Frontend Updates**
```powershell
# Option 1: Use automated script
.\update-frontend.ps1

# Option 2: Manual process
npm run build
netlify deploy --prod --dir=dist
```

#### **Backend Updates**
```powershell
# Option 1: Use automated script
.\update-backend.ps1

# Option 2: Manual process
cd server
git add .
git commit -m "Your changes description"
git push origin main
cd ..
```

#### **Complete Update (Both)**
```powershell
.\update-deployment.ps1
```

## 🔄 Auto-Deployment Details

### **Render (Backend)**
- **Trigger**: Any push to GitHub main branch
- **Build**: Automatic (Node.js detected)
- **Deploy Time**: 2-3 minutes
- **Health Check**: https://staff-management-api-hzq0.onrender.com/api/health

### **Netlify (Frontend)**
- **Trigger**: Manual deployment via CLI
- **Build**: `npm run build` → `dist/` directory
- **Deploy Time**: 30-60 seconds
- **Configuration**: `netlify.toml`

## 🛠️ Key Configuration Files

### **netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_URL = "https://staff-management-api-hzq0.onrender.com/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **server/server-new.js - CORS Configuration**
```javascript
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:5174',  // Alternative Vite port
  'http://localhost:3000',  // This server
  'http://127.0.0.1:5173',  // Alternative localhost
  'http://127.0.0.1:5174',  
  'http://127.0.0.1:3000',
  'https://fanciful-cendol-4eb10b.netlify.app', // Netlify production URL
];
```

### **src/services/api.ts - Environment Awareness**
```typescript
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for development
  return 'http://localhost:3000/api';
};
```

## 📊 Database Schema

### **Collections**
1. **staff** - Employee records
2. **vacations** - Vacation management (fully integrated)

### **Vacation Document Structure**
```javascript
{
  _id: ObjectId,
  staffId: ObjectId,
  startDate: Date,
  endDate: Date,
  reason: String,
  status: String, // "pending", "approved", "rejected"
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 API Endpoints

### **Staff Management**
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### **Vacation Management**
- `GET /api/staff/:id/vacations` - Get staff vacations
- `POST /api/staff/:id/vacations` - Create vacation
- `PUT /api/vacations/:id` - Update vacation
- `DELETE /api/vacations/:id` - Delete vacation

### **Utility**
- `GET /api/health` - Health check
- `POST /api/staff/bulk` - Bulk import staff

## 🐛 Troubleshooting

### **Common Issues & Solutions**

1. **CORS Errors**:
   - Check allowedOrigins in server-new.js
   - Verify Netlify URL is included in CORS settings

2. **Database Connection Issues**:
   - Verify MONGODB_URI in Render environment variables
   - Check MongoDB Atlas network access settings

3. **Build Failures**:
   - Run `npm run build` locally to test
   - Check console for TypeScript errors

4. **Deployment Delays**:
   - Render: Check deployment logs in dashboard
   - Netlify: Verify CLI authentication with `netlify status`

### **Health Checks**
```bash
# Backend health
curl https://staff-management-api-hzq0.onrender.com/api/health

# Frontend access
curl https://fanciful-cendol-4eb10b.netlify.app
```

## 🔐 Security Notes

- MongoDB connection uses SSL/TLS
- CORS properly configured for production
- Environment variables secure in hosting platforms
- No sensitive data in repository

## 📞 Support Resources

- **Render Support**: https://render.com/docs
- **Netlify Support**: https://docs.netlify.com
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

## 📝 Change Log

- **2025-08-13**: Initial deployment completed
- **2025-08-13**: Vacation management MongoDB integration
- **2025-08-13**: CORS updated for Netlify frontend
- **2025-08-13**: Complete documentation created

---

**Note**: This documentation contains all necessary information to maintain and update the Staff Management System deployment. Keep this file updated when making significant changes.
