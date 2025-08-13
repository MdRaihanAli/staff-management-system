// Utility to clean downloaded JSON for re-import
// This removes MongoDB internal fields and prepares data for clean import

const fs = require('fs');

// Read the downloaded file
const inputFile = 'c:\\Users\\User\\Downloads\\staff_data_2025-08-13 (1).json';
const outputFile = 'c:\\Users\\User\\Desktop\\New folder (2)\\staff_management\\cleaned_staff_data.json';

try {
  const rawData = fs.readFileSync(inputFile, 'utf8');
  const staffData = JSON.parse(rawData);
  
  // Clean the data - remove MongoDB internal fields and duplicates
  const cleanedData = [];
  const seenBatchNumbers = new Set();
  const seenNames = new Set();
  
  staffData.forEach((staff, index) => {
    // Skip if essential data is missing
    if (!staff.name || staff.name.trim() === '') {
      console.log(`Skipping record ${index + 1}: Missing name`);
      return;
    }
    
    // Check for duplicates by name + batch combination
    const identifier = `${staff.name.trim()}_${(staff.batchNo || '').trim()}`;
    if (seenNames.has(identifier)) {
      console.log(`Skipping duplicate: ${staff.name} (${staff.batchNo || 'No batch'})`);
      return;
    }
    seenNames.add(identifier);
    
    // Clean the staff object - remove MongoDB fields
    const cleanStaff = {
      batchNo: staff.batchNo || '',
      name: staff.name || '',
      department: staff.department || '',
      company: staff.company || '',
      visaType: staff.visaType || '',
      cardNo: staff.cardNo || '',
      issueDate: staff.issueDate || '',
      expireDate: staff.expireDate || '',
      phone: staff.phone || '',
      status: staff.status || 'Working',
      photo: staff.photo || '',
      remark: staff.remark || '',
      hotel: staff.hotel || '',
      salary: staff.salary || 0,
      passportExpireDate: staff.passportExpireDate || ''
    };
    
    cleanedData.push(cleanStaff);
  });
  
  // Write cleaned data
  fs.writeFileSync(outputFile, JSON.stringify(cleanedData, null, 2));
  
  console.log(`✅ Cleaned data written to: ${outputFile}`);
  console.log(`📊 Original records: ${staffData.length}`);
  console.log(`📊 Cleaned records: ${cleanedData.length}`);
  console.log(`📊 Removed duplicates/invalid: ${staffData.length - cleanedData.length}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
