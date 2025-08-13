# 🔧 Quick Reference Commands

## 🚀 Deployment Commands

### Frontend (Netlify)
```powershell
# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Or use automated script
.\update-frontend.ps1
```

### Backend (Render)
```powershell
# Push to trigger auto-deploy
cd server
git add .
git commit -m "Your update message"
git push origin main
cd ..

# Or use automated script
.\update-backend.ps1
```

### Both (Complete Update)
```powershell
.\update-deployment.ps1
```

## 🔗 Important URLs

- **Live App**: https://fanciful-cendol-4eb10b.netlify.app
- **API**: https://staff-management-api-hzq0.onrender.com
- **Health Check**: https://staff-management-api-hzq0.onrender.com/api/health

## 📊 Admin Dashboards

- **Netlify**: https://app.netlify.com/projects/fanciful-cendol-4eb10b
- **Render**: https://dashboard.render.com
- **MongoDB**: https://cloud.mongodb.com

## 🔍 Debug Commands

```powershell
# Check Netlify status
netlify status

# Test API health
curl https://staff-management-api-hzq0.onrender.com/api/health

# Local development
npm run dev  # Frontend
cd server && node server-new.js  # Backend
```

## 🔄 Environment Variables

### Netlify (Frontend)
- `VITE_API_URL`: https://staff-management-api-hzq0.onrender.com/api

### Render (Backend)
- `MONGODB_URI`: MongoDB Atlas connection string
- `NODE_ENV`: production
- `PORT`: 3000

## 📱 Features Available

✅ Staff CRUD operations  
✅ Vacation management (MongoDB integrated)  
✅ Data export/import  
✅ Responsive design  
✅ Production deployment  
✅ Auto-save vacation data
