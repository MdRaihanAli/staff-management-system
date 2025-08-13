# 💾 Backup Information - Staff Management System

## 🔑 Critical Information

### **Account Credentials & Access**
- **GitHub Repo**: https://github.com/MdRaihanAli/staff-management-system
- **Netlify Project**: fanciful-cendol-4eb10b
- **MongoDB Cluster**: cluster0.q8hlybw.mongodb.net

### **Production URLs**
- **Frontend**: https://fanciful-cendol-4eb10b.netlify.app
- **Backend**: https://staff-management-api-hzq0.onrender.com
- **API Base**: https://staff-management-api-hzq0.onrender.com/api

### **Database Information**
- **Provider**: MongoDB Atlas
- **Cluster**: cluster0.q8hlybw.mongodb.net
- **Database**: staff_management
- **Collections**: staff, vacations

## 🎯 Key Problem Solved

**Original Issue**: "vacation management data why not save in mongodb. after refresh i can't see any information"

**Solution Implemented**:
1. ✅ Complete MongoDB integration for vacation system
2. ✅ Proper data persistence across page refreshes
3. ✅ Full CRUD operations for vacation management
4. ✅ Production deployment on Render + Netlify

## 🔧 Technical Configuration

### **CORS Settings** (server/server-new.js)
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'https://fanciful-cendol-4eb10b.netlify.app',
];
```

### **API Service** (src/services/api.ts)
```typescript
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:3000/api';
};
```

### **Netlify Config** (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_URL = "https://staff-management-api-hzq0.onrender.com/api"
```

## 📋 Vacation API Endpoints

```javascript
// Get staff vacations
GET /api/staff/:id/vacations

// Create vacation
POST /api/staff/:id/vacations
Body: { startDate, endDate, reason, status }

// Update vacation  
PUT /api/vacations/:id
Body: { startDate, endDate, reason, status }

// Delete vacation
DELETE /api/vacations/:id
```

## 🚀 Deployment Scripts Created

1. **update-frontend.ps1** - Updates Netlify deployment
2. **update-backend.ps1** - Updates Render deployment  
3. **update-deployment.ps1** - Updates both frontend and backend
4. **deploy-netlify.ps1** - Initial Netlify deployment script

## 🔄 Auto-Deployment Flow

### **Backend (Render)**
1. Make changes to server code
2. `git add . && git commit -m "message" && git push origin main`
3. Render auto-deploys in 2-3 minutes

### **Frontend (Netlify)**  
1. Make changes to frontend code
2. `npm run build && netlify deploy --prod --dir=dist`
3. Deploys in 30-60 seconds

## 🛠️ File Structure Reference

### **Key Backend Files**
- `server/server-new.js` - Main production server
- `server/package.json` - Dependencies & build script

### **Key Frontend Files**
- `src/services/api.ts` - Environment-aware API service
- `src/contexts/StaffContext.tsx` - Staff state management
- `netlify.toml` - Netlify deployment configuration

## 📊 Database Schema

### **Vacation Document**
```javascript
{
  _id: ObjectId,
  staffId: ObjectId, // References staff collection
  startDate: Date,
  endDate: Date, 
  reason: String,
  status: String, // "pending", "approved", "rejected"
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Health Check Commands

```bash
# API Health
curl https://staff-management-api-hzq0.onrender.com/api/health

# Test vacation endpoint
curl https://staff-management-api-hzq0.onrender.com/api/staff/[STAFF_ID]/vacations
```

## 🆘 Emergency Recovery

If you ever need to redeploy from scratch:

1. **Backend**: Push any commit to GitHub main branch
2. **Frontend**: Run `netlify deploy --prod --dir=dist` 
3. **Database**: No action needed (MongoDB Atlas always available)

## 📝 Important Notes

- ✅ Vacation data now persists in MongoDB
- ✅ CORS properly configured for production
- ✅ Environment variables set correctly
- ✅ Auto-deployment working for backend
- ✅ Manual deployment ready for frontend

**Last Updated**: August 13, 2025  
**Status**: ✅ Fully Deployed & Working
