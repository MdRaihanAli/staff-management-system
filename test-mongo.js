const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/staff_management';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log(`📍 Connecting to: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database info:');
    console.log(`   - Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`   - Connection state: ${mongoose.connection.readyState}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   - Collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(`     * ${col.name}`);
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error('');
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Make sure MongoDB is installed and running');
    console.error('   2. Check if MongoDB service is started:');
    console.error('      - Windows: Check Services (services.msc)');
    console.error('      - macOS: brew services start mongodb-community');
    console.error('      - Linux: sudo systemctl start mongod');
    console.error('   3. Verify MongoDB is listening on port 27017');
    console.error('   4. Try connecting with MongoDB Compass to test');
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

testConnection();
