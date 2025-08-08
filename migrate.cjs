const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import the Staff model
const Staff = require('./server/models/Staff');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/staff_management';

async function migrateData() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Read the existing JSON data
    const jsonFilePath = path.join(__dirname, 'public', 'staff_data_100.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      console.log('❌ staff_data_100.json not found in public folder');
      process.exit(1);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    let staffData = [];
    if (Array.isArray(jsonData)) {
      // Old format - just staff array
      staffData = jsonData;
    } else if (jsonData.staff) {
      // New format - complete data structure
      staffData = jsonData.staff;
    }

    console.log(`📊 Found ${staffData.length} staff records to migrate`);

    // Clear existing data
    console.log('🧹 Clearing existing staff data in MongoDB...');
    await Staff.deleteMany({});

    // Insert new data
    console.log('📥 Inserting staff data into MongoDB...');
    for (const staffMember of staffData) {
      try {
        // Remove the old 'id' field and let MongoDB generate _id
        const { id, ...staffWithoutId } = staffMember;
        const newStaff = new Staff(staffWithoutId);
        await newStaff.save();
        console.log(`✅ Migrated: ${staffMember.name}`);
      } catch (error) {
        console.error(`❌ Error migrating ${staffMember.name}:`, error.message);
      }
    }

    console.log('🎉 Migration completed successfully!');
    console.log('📋 Summary:');
    const totalStaff = await Staff.countDocuments();
    console.log(`   - Total staff in MongoDB: ${totalStaff}`);
    
    // Display first few records
    const sampleStaff = await Staff.find().limit(3);
    console.log('   - Sample records:');
    sampleStaff.forEach(staff => {
      console.log(`     * ${staff.name} (${staff.department}) - ID: ${staff._id}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration
console.log('🚀 Starting MongoDB migration...');
migrateData();
