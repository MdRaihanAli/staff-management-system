// Script to fix vacation requests with invalid staff IDs
// This ensures all vacation requests reference valid staff members

const baseUrl = 'http://localhost:3000/api';

async function fixVacationStaffIds() {
  try {
    console.log('🔄 Fetching vacation requests...');
    const vacationsResponse = await fetch(`${baseUrl}/vacations`);
    const vacationsData = await vacationsResponse.json();
    const vacations = vacationsData.data || vacationsData;
    
    console.log('🔄 Fetching staff members...');
    const staffResponse = await fetch(`${baseUrl}/staff`);
    const staffData = await staffResponse.json();
    const staff = staffData.data || staffData;
    
    console.log(`📊 Found ${vacations.length} vacation requests and ${staff.length} staff members`);
    
    let fixedCount = 0;
    
    for (const vacation of vacations) {
      // Check if staff ID exists
      const staffExists = staff.find(s => s.id === vacation.staffId);
      
      if (!staffExists) {
        console.log(`❌ Invalid staff ID ${vacation.staffId} in vacation ${vacation.id} for ${vacation.staffName}`);
        
        // Try to find staff by name
        const staffByName = staff.find(s => s.name === vacation.staffName);
        
        if (staffByName) {
          console.log(`✅ Found matching staff by name: ${staffByName.name} (ID: ${staffByName.id})`);
          
          // Update the vacation request
          const updateResponse = await fetch(`${baseUrl}/vacations/${vacation.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              staffId: staffByName.id,
              staffName: staffByName.name,
              staffBatch: staffByName.batchNo 
            })
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Updated vacation ${vacation.id} with correct staff ID ${staffByName.id}`);
            fixedCount++;
          } else {
            console.error(`❌ Failed to update vacation ${vacation.id}`);
          }
        } else {
          console.error(`❌ Could not find staff member with name: ${vacation.staffName}`);
        }
      }
    }
    
    console.log(`🎉 Fixed ${fixedCount} vacation requests with invalid staff IDs`);
    
  } catch (error) {
    console.error('❌ Error fixing vacation staff IDs:', error);
  }
}

// Run the fix
fixVacationStaffIds();
