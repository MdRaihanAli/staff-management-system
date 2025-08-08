# 🏨 Staff Management System

A comprehensive, full-stack staff management application for hotels with MongoDB integration, advanced filtering, statistics, and export capabilities.

## 🌟 Features

### ✅ **Staff Management**
- Complete CRUD operations for staff members
- Advanced search and filtering by hotel, company, department
- Bulk import/export functionality (Excel, CSV, JSON)
- Real-time statistics and department breakdowns

### ✅ **Database Integration**
- **MongoDB**: Production-ready with Mongoose ODM
- **JSON Fallback**: Works without database for development
- **API First**: RESTful endpoints with proper error handling
- **Data Migration**: Transfer existing data to MongoDB

### ✅ **Modern Architecture**
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Express.js + MongoDB/Mongoose
- **API**: RESTful with CORS, validation, and error handling
- **Development**: Hot reload, TypeScript, ESLint

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Start Application (No Database Required)
```bash
npm run start:json
```
- **Frontend**: http://localhost:5175
- **Backend**: http://localhost:5000
- **Uses**: JSON file storage (perfect for development)

### 3. MongoDB Setup (Optional)
```bash
# Test MongoDB connection
npm run test:mongo

# Start with MongoDB
npm run start

# Migrate existing data
npm run migrate
```

## 📋 Available Commands

### **Development**
```bash
npm run dev              # Frontend only
npm run server:json      # Backend (JSON mode)
npm run server          # Backend (MongoDB mode)
npm run start:json      # Full app (JSON mode) - Recommended
npm run start           # Full app (MongoDB mode)
```

### **Database**
```bash
npm run test:mongo      # Test MongoDB connection
npm run migrate         # Transfer data to MongoDB
```

### **Production**
```bash
npm run build           # Build for production
npm run start:prod      # Production server
```

## 🗄️ Database Options

### **Option A: JSON Mode (Default)**
- ✅ **No setup required**
- ✅ **Perfect for development**
- ✅ **Uses existing data files**
- 📁 **Storage**: `public/staff_data_100.json`

### **Option B: MongoDB (Production)**
- 🔧 **Requires MongoDB installation**
- 🚀 **Scalable for production**
- 👥 **Multi-user support**
- 🔐 **Data validation and integrity**

#### MongoDB Setup:
1. **Local**: Download from [MongoDB Community](https://www.mongodb.com/try/download/community)
2. **Cloud**: Sign up for [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
3. **Update `.env`** with your connection string

## 🏗️ Project Structure

```
├── 📁 server/
│   ├── server.js           # MongoDB API server
│   ├── server-json.cjs     # JSON API server
│   ├── models/Staff.js     # MongoDB schema
│   └── routes/             # API endpoints
├── 📁 src/
│   ├── components/         # React components
│   ├── contexts/          # State management
│   ├── services/api.ts    # API integration
│   └── types/staff.ts     # TypeScript definitions
├── 📁 public/
│   └── staff_data_100.json # JSON data storage
└── 📄 Configuration files
```

## 🔧 Configuration

### **Environment Variables (`.env`)**
```env
# MongoDB (when using MongoDB mode)
MONGODB_URI=mongodb://localhost:27017/staff_management

# Server
PORT=5000
FRONTEND_URL=http://localhost:5175
NODE_ENV=development
```

## 📊 API Endpoints

### **Staff Management**
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff
- `POST /api/staff/bulk` - Bulk create

### **Filter Data**
- `GET /api/hotels` - Get all hotels
- `GET /api/companies` - Get all companies
- `GET /api/departments` - Get all departments

### **System**
- `GET /api/health` - System health check
- `GET /api` - API documentation

## 🎯 Usage Examples

### **Adding Staff**
1. Navigate to the application
2. Click "Add New Staff"
3. Fill in required information
4. Data automatically saves via API

### **Filtering & Export**
1. Use search filters (hotel, company, department)
2. View real-time statistics
3. Export filtered results to Excel/CSV

### **Data Migration**
```bash
# Transfer existing JSON data to MongoDB
npm run migrate
```

## 🔍 Troubleshooting

### **MongoDB Connection Issues**
```bash
# Test connection
npm run test:mongo

# Use JSON mode instead
npm run start:json
```

### **Port Conflicts**
- Frontend auto-finds available ports (5173, 5174, 5175...)
- Backend uses PORT environment variable (default: 5000)

### **CORS Issues**
- CORS automatically configured for detected frontend port
- Update `FRONTEND_URL` in `.env` if needed

## 🚀 Deployment

### **Frontend (Vite)**
```bash
npm run build
# Deploy `dist/` folder to your hosting service
```

### **Backend**
```bash
# Set production environment
NODE_ENV=production npm run start:prod

# Or deploy to your cloud provider
```

## 📝 Technologies Used

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Tools**: ESLint, Prettier, Concurrently, Nodemon
- **Export**: XLSX, DocX, File-Saver

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

### 🎉 **Ready to Use!**

Your staff management system is now complete with enterprise-level features. Start with:

```bash
npm run start:json
```

Visit **http://localhost:5175** and begin managing your staff data! 🚀
