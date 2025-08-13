# Staff Management Server v2.0

A robust MongoDB-based REST API server for the Staff Management System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed)
mongod

# Or using MongoDB Compass - just start the application
```

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Staff Management
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create new staff member
- `GET /api/staff/:id` - Get specific staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member
- `POST /api/staff/bulk` - Bulk operations (delete, update hotel, update status)

### Hotels Management
- `GET /api/hotels` - Get all hotels
- `POST /api/hotels` - Add new hotel
- `DELETE /api/hotels/:name` - Delete hotel

### Companies Management
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Add new company
- `DELETE /api/companies/:name` - Delete company

### Departments Management
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Add new department
- `DELETE /api/departments/:name` - Delete department

### System
- `GET /api/test` - Test server connectivity
- `GET /api/health` - Health check with database status
- `GET /api/stats` - Get system statistics

## 🔧 Configuration

Edit `.env` file to configure:
- MongoDB connection string
- Server port
- Database name
- CORS origins

## ✨ Features

- ✅ **Complete CORS Support** - Configured for frontend on ports 5173/5174
- ✅ **MongoDB Integration** - Full CRUD operations with proper indexing
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Bulk Operations** - Efficient bulk delete and update operations
- ✅ **Data Transformation** - Proper ID field handling for frontend compatibility
- ✅ **Health Monitoring** - Health check and statistics endpoints
- ✅ **Auto-Indexing** - Database indexes for optimal performance
- ✅ **Graceful Shutdown** - Proper cleanup on server stop

## 🔍 Testing

Test server connectivity:
```bash
curl http://localhost:3000/api/test
```

Test with your frontend running on port 5173:
```bash
curl http://localhost:5173
```

## 📝 Logs

The server provides detailed console logging:
- 🔄 Connection status
- ✅ Successful operations
- ❌ Error details
- 📊 Request statistics

## 🛟 Troubleshooting

1. **MongoDB Connection Issues**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **CORS Issues**:
   - Frontend origins are pre-configured
   - Check browser console for CORS errors

3. **Port Conflicts**:
   - Change PORT in `.env` file
   - Update frontend API_BASE_URL accordingly

## 📋 Collection Schema

### Staff Collection
```javascript
{
  _id: ObjectId,
  id: Number,
  sl: Number,
  batchNo: String,
  name: String,
  department: String,
  company: String,
  visaType: String,
  cardNo: String,
  issueDate: Date,
  expireDate: Date,
  phone: String,
  status: String,
  photo: String,
  remark: String,
  hotel: String,
  salary: Number,
  passportExpireDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```
