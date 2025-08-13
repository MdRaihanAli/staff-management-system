const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'staff_management';

let db;
let client;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:5174',  // Alternative Vite port
  'http://localhost:3000',  // This server
  'http://127.0.0.1:5173',  // Alternative localhost
  'http://127.0.0.1:5174',  
  'http://127.0.0.1:3000',
  'https://fanciful-cendol-4eb10b.netlify.app', // Netlify production URL
];

// Add production origins if environment variables are set
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.PRODUCTION_URL) {
  allowedOrigins.push(process.env.PRODUCTION_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, allow any HTTPS origin for now (you can restrict this later)
    if (process.env.NODE_ENV === 'production' && origin.startsWith('https://')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Response helper function
const sendResponse = (res, data, message = 'Success') => {
  res.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    server: 'Staff Management API v2.0'
  });
};

const sendError = (res, error, statusCode = 500) => {
  console.error('API Error:', error);
  res.status(statusCode).json({
    success: false,
    error: error.message || error,
    timestamp: new Date().toISOString(),
    server: 'Staff Management API v2.0'
  });
};

// MongoDB connection
async function connectToMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    
    // Test connection
    await db.admin().ping();
    console.log('✅ Connected to MongoDB successfully');
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Create database indexes
async function createIndexes() {
  try {
    const staffCollection = db.collection('staff');
    await staffCollection.createIndex({ name: 1 });
    await staffCollection.createIndex({ batchNo: 1 });
    await staffCollection.createIndex({ department: 1 });
    await staffCollection.createIndex({ hotel: 1 });
    await staffCollection.createIndex({ status: 1 });
    console.log('📇 Database indexes created');
  } catch (error) {
    console.log('⚠️ Index creation warning:', error.message);
  }
}

// Utility function to transform MongoDB documents
const transformStaffDocument = (doc) => {
  if (!doc) return null;
  return {
    _id: doc._id,
    id: doc.id || parseInt(doc._id.toString().slice(-6), 16), // Generate numeric ID from ObjectId
    sl: doc.sl || 0,
    batchNo: doc.batchNo || '',
    name: doc.name || '',
    department: doc.department || '',
    company: doc.company || '',
    visaType: doc.visaType || '',
    cardNo: doc.cardNo || '',
    issueDate: doc.issueDate || null,
    expireDate: doc.expireDate || null,
    phone: doc.phone || '',
    status: doc.status || '',
    photo: doc.photo || '',
    remark: doc.remark || '',
    hotel: doc.hotel || '',
    salary: doc.salary || 0,
    passportExpireDate: doc.passportExpireDate || null,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date()
  };
};

// Root endpoint for Render deployment verification
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Staff Management API Server is running',
    version: '2.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      staff: '/api/staff',
      vacations: '/api/vacations',
      test: '/api/test'
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  sendResponse(res, null, 'Server is running and accessible');
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.admin().ping();
    sendResponse(res, {
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime()
    }, 'System is healthy');
  } catch (error) {
    sendError(res, 'Database connection failed', 503);
  }
});

// STAFF ENDPOINTS

// Get all staff
app.get('/api/staff', async (req, res) => {
  try {
    console.log('📋 Fetching all staff...');
    const staff = await db.collection('staff').find({}).sort({ sl: 1 }).toArray();
    const transformedStaff = staff.map(transformStaffDocument);
    console.log(`✅ Found ${transformedStaff.length} staff members`);
    sendResponse(res, transformedStaff);
  } catch (error) {
    sendError(res, error);
  }
});

// Get single staff member
app.get('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query;
    
    // Try to find by ObjectId first, then by numeric id
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) };
    }
    
    const staff = await db.collection('staff').findOne(query);
    if (!staff) {
      return sendError(res, 'Staff member not found', 404);
    }
    
    sendResponse(res, transformStaffDocument(staff));
  } catch (error) {
    sendError(res, error);
  }
});

// Create new staff member
app.post('/api/staff', async (req, res) => {
  try {
    console.log('➕ Creating new staff member...');
    const staffData = req.body;
    
    // Generate SL number
    const lastStaff = await db.collection('staff').findOne({}, { sort: { sl: -1 } });
    const newSl = lastStaff ? (lastStaff.sl || 0) + 1 : 1;
    
    // Prepare document
    const newStaff = {
      ...staffData,
      sl: newSl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('staff').insertOne(newStaff);
    const createdStaff = await db.collection('staff').findOne({ _id: result.insertedId });
    
    console.log(`✅ Staff member created with ID: ${result.insertedId}`);
    sendResponse(res, transformStaffDocument(createdStaff), 'Staff member created successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Update staff member
app.put('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('🔄 PUT Request - ID received:', id);
    console.log('🔄 PUT Request - Update data:', JSON.stringify(updateData, null, 2));
    
    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
      console.log('✅ Using ObjectId query:', query);
    } else {
      query = { id: parseInt(id) };
      console.log('✅ Using numeric ID query:', query);
    }
    
    // Check if document exists first
    const existingDoc = await db.collection('staff').findOne(query);
    console.log('🔍 Existing document found:', existingDoc ? 'YES' : 'NO');
    if (existingDoc) {
      console.log('📄 Existing document:', JSON.stringify(existingDoc, null, 2));
    }
    
    // Remove _id from update data to avoid conflicts
    delete updateData._id;
    updateData.updatedAt = new Date();
    
    const result = await db.collection('staff').findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    console.log('📊 Update result:', result);
    
    // Check both result and result.value for compatibility
    const updatedDocument = result.value || result;
    
    if (!updatedDocument) {
      console.log('❌ No document found to update');
      return sendError(res, 'Staff member not found', 404);
    }
    
    console.log(`✅ Staff member updated: ${id}`);
    sendResponse(res, transformStaffDocument(updatedDocument), 'Staff member updated successfully');
  } catch (error) {
    console.error('❌ PUT Error:', error);
    sendError(res, error);
  }
});

// Delete staff member
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) };
    }
    
    const result = await db.collection('staff').deleteOne(query);
    
    if (result.deletedCount === 0) {
      return sendError(res, 'Staff member not found', 404);
    }
    
    console.log(`✅ Staff member deleted: ${id}`);
    sendResponse(res, { deletedCount: result.deletedCount }, 'Staff member deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Bulk operations endpoint
app.post('/api/staff/bulk', async (req, res) => {
  try {
    const { action, ids, data } = req.body;
    
    // Convert string IDs to ObjectIds where appropriate
    const objectIds = ids.map(id => {
      if (ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      return id;
    });
    
    let result;
    
    switch (action) {
      case 'delete':
        result = await db.collection('staff').deleteMany({
          $or: [
            { _id: { $in: objectIds } },
            { id: { $in: ids.map(id => parseInt(id)).filter(id => !isNaN(id)) } }
          ]
        });
        console.log(`✅ Bulk deleted ${result.deletedCount} staff members`);
        sendResponse(res, { deletedCount: result.deletedCount }, `Deleted ${result.deletedCount} staff members`);
        break;
        
      case 'updateHotel':
        result = await db.collection('staff').updateMany(
          {
            $or: [
              { _id: { $in: objectIds } },
              { id: { $in: ids.map(id => parseInt(id)).filter(id => !isNaN(id)) } }
            ]
          },
          { $set: { hotel: data.hotel, updatedAt: new Date() } }
        );
        console.log(`✅ Bulk updated hotel for ${result.modifiedCount} staff members`);
        sendResponse(res, { modifiedCount: result.modifiedCount }, `Updated hotel for ${result.modifiedCount} staff members`);
        break;
        
      case 'updateStatus':
        result = await db.collection('staff').updateMany(
          {
            $or: [
              { _id: { $in: objectIds } },
              { id: { $in: ids.map(id => parseInt(id)).filter(id => !isNaN(id)) } }
            ]
          },
          { $set: { status: data.status, updatedAt: new Date() } }
        );
        console.log(`✅ Bulk updated status for ${result.modifiedCount} staff members`);
        sendResponse(res, { modifiedCount: result.modifiedCount }, `Updated status for ${result.modifiedCount} staff members`);
        break;
        
      default:
        return sendError(res, 'Invalid bulk action', 400);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// HOTELS ENDPOINTS

// Get all hotels
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await db.collection('hotels').find({}).toArray();
    const hotelNames = hotels.map(h => h.name);
    sendResponse(res, hotelNames);
  } catch (error) {
    sendError(res, error);
  }
});

// Add hotel
app.post('/api/hotels', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return sendError(res, 'Hotel name is required', 400);
    }
    
    // Check if hotel already exists
    const existing = await db.collection('hotels').findOne({ name });
    if (existing) {
      return sendError(res, 'Hotel already exists', 409);
    }
    
    await db.collection('hotels').insertOne({ name, createdAt: new Date() });
    console.log(`✅ Hotel added: ${name}`);
    sendResponse(res, { name }, 'Hotel added successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Delete hotel
app.delete('/api/hotels/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    
    const result = await db.collection('hotels').deleteOne({ name: decodedName });
    if (result.deletedCount === 0) {
      return sendError(res, 'Hotel not found', 404);
    }
    
    console.log(`✅ Hotel deleted: ${decodedName}`);
    sendResponse(res, { name: decodedName }, 'Hotel deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// COMPANIES ENDPOINTS

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await db.collection('companies').find({}).toArray();
    const companyNames = companies.map(c => c.name);
    sendResponse(res, companyNames);
  } catch (error) {
    sendError(res, error);
  }
});

// Add company
app.post('/api/companies', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return sendError(res, 'Company name is required', 400);
    }
    
    const existing = await db.collection('companies').findOne({ name });
    if (existing) {
      return sendError(res, 'Company already exists', 409);
    }
    
    await db.collection('companies').insertOne({ name, createdAt: new Date() });
    console.log(`✅ Company added: ${name}`);
    sendResponse(res, { name }, 'Company added successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Delete company
app.delete('/api/companies/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    
    const result = await db.collection('companies').deleteOne({ name: decodedName });
    if (result.deletedCount === 0) {
      return sendError(res, 'Company not found', 404);
    }
    
    console.log(`✅ Company deleted: ${decodedName}`);
    sendResponse(res, { name: decodedName }, 'Company deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// DEPARTMENTS ENDPOINTS

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await db.collection('departments').find({}).toArray();
    const departmentNames = departments.map(d => d.name);
    sendResponse(res, departmentNames);
  } catch (error) {
    sendError(res, error);
  }
});

// Add department
app.post('/api/departments', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return sendError(res, 'Department name is required', 400);
    }
    
    const existing = await db.collection('departments').findOne({ name });
    if (existing) {
      return sendError(res, 'Department already exists', 409);
    }
    
    await db.collection('departments').insertOne({ name, createdAt: new Date() });
    console.log(`✅ Department added: ${name}`);
    sendResponse(res, { name }, 'Department added successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Delete department
app.delete('/api/departments/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    
    const result = await db.collection('departments').deleteOne({ name: decodedName });
    if (result.deletedCount === 0) {
      return sendError(res, 'Department not found', 404);
    }
    
    console.log(`✅ Department deleted: ${decodedName}`);
    sendResponse(res, { name: decodedName }, 'Department deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// STATISTICS ENDPOINT
app.get('/api/stats', async (req, res) => {
  try {
    const [
      totalStaff,
      workingStaff,
      joblessStaff,
      exitedStaff,
      hotels,
      companies,
      departments
    ] = await Promise.all([
      db.collection('staff').countDocuments({}),
      db.collection('staff').countDocuments({ status: 'Working' }),
      db.collection('staff').countDocuments({ status: 'Jobless' }),
      db.collection('staff').countDocuments({ status: 'Exited' }),
      db.collection('hotels').countDocuments({}),
      db.collection('companies').countDocuments({}),
      db.collection('departments').countDocuments({})
    ]);
    
    sendResponse(res, {
      staff: {
        total: totalStaff,
        working: workingStaff,
        jobless: joblessStaff,
        exited: exitedStaff
      },
      hotels,
      companies,
      departments
    });
  } catch (error) {
    sendError(res, error);
  }
});

// VACATION MANAGEMENT ENDPOINTS

// Get all vacations
app.get('/api/vacations', async (req, res) => {
  try {
    const vacations = await db.collection('vacations').find({}).toArray();
    console.log(`📋 Fetching ${vacations.length} vacation requests`);
    sendResponse(res, vacations);
  } catch (error) {
    sendError(res, error);
  }
});

// Create vacation request
app.post('/api/vacations', async (req, res) => {
  try {
    const vacationData = req.body;
    
    // Generate ID
    const existingVacations = await db.collection('vacations').find({}).toArray();
    const maxId = existingVacations.length > 0 ? Math.max(...existingVacations.map(v => v.id || 0)) : 0;
    
    const vacation = {
      ...vacationData,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('vacations').insertOne(vacation);
    vacation._id = result.insertedId;
    
    console.log(`✅ Vacation request created: ${vacation.id} for ${vacation.staffName}`);
    sendResponse(res, vacation, 'Vacation request created successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Update vacation request
app.put('/api/vacations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();
    
    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) };
    }
    
    const result = await db.collection('vacations').findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    const updatedDocument = result.value || result;
    
    if (!updatedDocument) {
      return sendError(res, 'Vacation request not found', 404);
    }
    
    console.log(`✅ Vacation request updated: ${id}`);
    sendResponse(res, updatedDocument, 'Vacation request updated successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Delete vacation request
app.delete('/api/vacations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) };
    }
    
    const result = await db.collection('vacations').deleteOne(query);
    
    if (result.deletedCount === 0) {
      return sendError(res, 'Vacation request not found', 404);
    }
    
    console.log(`✅ Vacation request deleted: ${id}`);
    sendResponse(res, { deletedCount: result.deletedCount }, 'Vacation request deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
});

// Get vacation statistics
app.get('/api/vacations/stats', async (req, res) => {
  try {
    const vacations = await db.collection('vacations').find({}).toArray();
    
    const stats = {
      totalRequests: vacations.length,
      pendingRequests: vacations.filter(v => v.status === 'Pending').length,
      approvedRequests: vacations.filter(v => v.status === 'Approved').length,
      ongoingVacations: vacations.filter(v => v.status === 'Ongoing').length,
      completedVacations: vacations.filter(v => v.status === 'Completed').length,
      rejectedRequests: vacations.filter(v => v.status === 'Rejected').length,
      totalDaysRequested: vacations.reduce((sum, v) => sum + (v.totalDays || 0), 0),
      totalSalaryHeld: vacations.reduce((sum, v) => sum + (v.salaryHold || 0), 0),
      totalAdvanceGiven: vacations.reduce((sum, v) => sum + (v.salaryAdvance || 0), 0)
    };
    
    console.log('📊 Vacation statistics calculated');
    sendResponse(res, stats);
  } catch (error) {
    sendError(res, error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  sendError(res, 'Internal server error', 500);
});

// 404 handler
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
      console.log('\n🚀 Staff Management Server v2.0 Started');
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🗄️ Database: ${DATABASE_NAME}`);
      console.log('📋 Available endpoints:');
      console.log('   GET    /api/test - Test server');
      console.log('   GET    /api/health - Health check');
      console.log('   GET    /api/staff - Get all staff');
      console.log('   POST   /api/staff - Create staff');
      console.log('   PUT    /api/staff/:id - Update staff');
      console.log('   DELETE /api/staff/:id - Delete staff');
      console.log('   POST   /api/staff/bulk - Bulk operations');
      console.log('   GET    /api/hotels - Get hotels');
      console.log('   GET    /api/companies - Get companies');
      console.log('   GET    /api/departments - Get departments');
      console.log('   GET    /api/vacations - Get all vacations');
      console.log('   POST   /api/vacations - Create vacation request');
      console.log('   PUT    /api/vacations/:id - Update vacation request');
      console.log('   DELETE /api/vacations/:id - Delete vacation request');
      console.log('   GET    /api/vacations/stats - Get vacation statistics');
      console.log('   GET    /api/stats - Get statistics');
      console.log('\n✅ Ready to accept connections!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
