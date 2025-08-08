// const express = require('express');
// const cors = require('cors');
// const fs = require('fs').promises;
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());

// // JSON file path
// const STAFF_DATA_FILE = path.join(__dirname, '..', 'public', 'staff_data.json');

// // Helper function to read JSON file
// async function readStaffData() {
//   try {
//     const data = await fs.readFile(STAFF_DATA_FILE, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     console.log('No existing staff data file found, starting with empty array');
//     return [];
//   }
// }

// // Helper function to write JSON file
// async function writeStaffData(data) {
//   await fs.writeFile(STAFF_DATA_FILE, JSON.stringify(data, null, 2));
// }

// // Staff Routes
// app.get('/api/staff', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     res.json(staff);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch staff' });
//   }
// });

// app.post('/api/staff', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const newStaff = {
//       id: Date.now().toString(), // Simple ID generation
//       _id: Date.now().toString(), // Also add _id for compatibility
//       ...req.body,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
//     staff.push(newStaff);
//     await writeStaffData(staff);
//     res.status(201).json(newStaff);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create staff' });
//   }
// });

// app.put('/api/staff/:id', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const index = staff.findIndex(s => s.id === req.params.id || s._id === req.params.id);
//     if (index === -1) {
//       return res.status(404).json({ error: 'Staff not found' });
//     }
//     staff[index] = {
//       ...staff[index],
//       ...req.body,
//       updatedAt: new Date()
//     };
//     await writeStaffData(staff);
//     res.json(staff[index]);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update staff' });
//   }
// });

// app.delete('/api/staff/:id', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const index = staff.findIndex(s => s.id === req.params.id || s._id === req.params.id);
//     if (index === -1) {
//       return res.status(404).json({ error: 'Staff not found' });
//     }
//     staff.splice(index, 1);
//     await writeStaffData(staff);
//     res.json({ message: 'Staff deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete staff' });
//   }
// });

// // Bulk operations
// app.post('/api/staff/bulk', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const newStaff = req.body.map(item => ({
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       ...item,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }));
//     staff.push(...newStaff);
//     await writeStaffData(staff);
//     res.status(201).json(newStaff);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to bulk create staff' });
//   }
// });

// // Get unique values for filters
// app.get('/api/hotels', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const hotels = [...new Set(staff.map(s => s.hotel).filter(Boolean))];
//     res.json(hotels);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch hotels' });
//   }
// });

// app.get('/api/companies', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const companies = [...new Set(staff.map(s => s.company).filter(Boolean))];
//     res.json(companies);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch companies' });
//   }
// });

// app.get('/api/departments', async (req, res) => {
//   try {
//     const staff = await readStaffData();
//     const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];
//     res.json(departments);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch departments' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'Staff Management API (JSON Mode)', 
//     timestamp: new Date().toISOString() 
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📁 Using JSON file storage: ${STAFF_DATA_FILE}`);
//   console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
//   console.log('📊 Ready to serve API requests!');
// });
