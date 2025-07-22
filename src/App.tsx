import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import AllStaffPage from './components/AllStaffPage'

interface Staff {
  id: number
  sl: number
  batchNo: string
  name: string
  designation: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless'
  photo: string
  remark: string
  hotel: string
  department: string
  salary: number
  hireDate: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'allstaff'>('home')
  const [staff, setStaff] = useState<Staff[]>([
    // Grand Plaza Hotel Staff
    {
      id: 1,
      sl: 1,
      batchNo: 'GP-001',
      name: 'John Smith',
      designation: 'Front Desk Manager',
      visaType: 'Employment',
      cardNo: 'EMP001234',
      issueDate: '2023-01-01',
      expireDate: '2025-01-01',
      phone: '+971-50-1234567',
      status: 'Working',
      photo: '',
      remark: 'Excellent performance',
      department: 'Front Desk',
      hotel: 'Grand Plaza Hotel',
      salary: 65000,
      hireDate: '2023-01-15'
    },
    {
      id: 2,
      sl: 2,
      batchNo: 'GP-002',
      name: 'Sarah Johnson',
      designation: 'Housekeeper',
      visaType: 'Employment',
      cardNo: 'EMP001235',
      issueDate: '2023-03-01',
      expireDate: '2025-03-01',
      phone: '+971-50-2345678',
      status: 'Working',
      photo: '',
      remark: 'Reliable worker',
      department: 'Housekeeping',
      hotel: 'Grand Plaza Hotel',
      salary: 35000,
      hireDate: '2023-03-20'
    },
    {
      id: 3,
      sl: 3,
      batchNo: 'GP-003',
      name: 'Mike Davis',
      designation: 'Chef',
      visaType: 'Employment',
      cardNo: 'EMP001236',
      issueDate: '2022-11-01',
      expireDate: '2024-11-01',
      phone: '+971-50-3456789',
      status: 'Working',
      photo: '',
      remark: 'Senior chef with experience',
      department: 'Kitchen',
      hotel: 'Grand Plaza Hotel',
      salary: 55000,
      hireDate: '2022-11-10'
    },
    {
      id: 4,
      sl: 4,
      batchNo: 'GP-004',
      name: 'Lisa Wilson',
      designation: 'Receptionist',
      visaType: 'Employment',
      cardNo: 'EMP001237',
      issueDate: '2023-05-01',
      expireDate: '2025-05-01',
      phone: '+971-50-4567890',
      status: 'Working',
      photo: '',
      remark: 'Good communication skills',
      department: 'Front Desk',
      hotel: 'Grand Plaza Hotel',
      salary: 40000,
      hireDate: '2023-05-01'
    },

    // Ocean View Resort Staff
    {
      id: 5,
      sl: 5,
      batchNo: 'OV-001',
      name: 'David Brown',
      designation: 'General Manager',
      visaType: 'Employment',
      cardNo: 'EMP002001',
      issueDate: '2021-08-01',
      expireDate: '2024-08-01',
      phone: '+971-50-5678901',
      status: 'Working',
      photo: '',
      remark: 'Management level',
      department: 'Management',
      hotel: 'Ocean View Resort',
      salary: 95000,
      hireDate: '2021-08-15'
    },
    {
      id: 6,
      sl: 6,
      batchNo: 'OV-002',
      name: 'Emma Martinez',
      designation: 'Server',
      visaType: 'Employment',
      cardNo: 'EMP002002',
      issueDate: '2023-06-01',
      expireDate: '2025-06-01',
      phone: '+971-50-6789012',
      status: 'Working',
      photo: '',
      remark: 'Customer service oriented',
      department: 'Restaurant',
      hotel: 'Ocean View Resort',
      salary: 32000,
      hireDate: '2023-06-12'
    },
    {
      id: 7,
      sl: 7,
      batchNo: 'OV-003',
      name: 'Chris Taylor',
      designation: 'Maintenance Worker',
      visaType: 'Employment',
      cardNo: 'EMP002003',
      issueDate: '2022-12-01',
      expireDate: '2024-12-01',
      phone: '+971-50-7890123',
      status: 'Working',
      photo: '',
      remark: 'Technical skills',
      department: 'Maintenance',
      hotel: 'Ocean View Resort',
      salary: 42000,
      hireDate: '2022-12-05'
    },
    {
      id: 8,
      sl: 8,
      batchNo: 'OV-004',
      name: 'Anna Garcia',
      designation: 'Housekeeping Supervisor',
      visaType: 'Employment',
      cardNo: 'EMP002004',
      issueDate: '2022-09-01',
      expireDate: '2024-09-01',
      phone: '+971-50-8901234',
      status: 'Working',
      photo: '',
      remark: 'Supervisory role',
      department: 'Housekeeping',
      hotel: 'Ocean View Resort',
      salary: 45000,
      hireDate: '2022-09-20'
    },

    // City Center Inn Staff
    {
      id: 9,
      sl: 9,
      batchNo: 'CC-001',
      name: 'Robert Lee',
      designation: 'Night Auditor',
      visaType: 'Employment',
      cardNo: 'EMP003001',
      issueDate: '2023-02-01',
      expireDate: '2025-02-01',
      phone: '+971-50-9012345',
      status: 'Working',
      photo: '',
      remark: 'Night shift specialist',
      department: 'Front Desk',
      hotel: 'City Center Inn',
      salary: 38000,
      hireDate: '2023-02-28'
    },
    {
      id: 10,
      sl: 10,
      batchNo: 'CC-002',
      name: 'Jennifer White',
      designation: 'Restaurant Manager',
      visaType: 'Employment',
      cardNo: 'EMP003002',
      issueDate: '2022-07-01',
      expireDate: '2024-07-01',
      phone: '+971-50-0123456',
      status: 'Working',
      photo: '',
      remark: 'F&B expertise',
      department: 'Restaurant',
      hotel: 'City Center Inn',
      salary: 58000,
      hireDate: '2022-07-14'
    },
    {
      id: 11,
      sl: 11,
      batchNo: 'CC-003',
      name: 'Mark Thompson',
      designation: 'Security Guard',
      visaType: 'Visit',
      cardNo: 'VIS003001',
      issueDate: '2023-04-01',
      expireDate: '2023-10-01',
      phone: '+971-50-1234560',
      status: 'Jobless',
      photo: '',
      remark: 'Contract ended',
      department: 'Management',
      hotel: 'City Center Inn',
      salary: 36000,
      hireDate: '2023-04-03'
    },

    // Mountain Lodge Staff
    {
      id: 12,
      sl: 12,
      batchNo: 'ML-001',
      name: 'Karen Anderson',
      designation: 'Assistant Manager',
      visaType: 'Employment',
      cardNo: 'EMP004001',
      issueDate: '2022-05-01',
      expireDate: '2024-05-01',
      phone: '+971-50-2345601',
      status: 'Working',
      photo: '',
      remark: 'Assistant management',
      department: 'Management',
      hotel: 'Mountain Lodge',
      salary: 72000,
      hireDate: '2022-05-18'
    },
    {
      id: 13,
      sl: 13,
      batchNo: 'ML-002',
      name: 'Paul Wilson',
      designation: 'Bartender',
      visaType: 'Employment',
      cardNo: 'EMP004002',
      issueDate: '2023-07-01',
      expireDate: '2025-07-01',
      phone: '+971-50-3456012',
      status: 'Working',
      photo: '',
      remark: 'Beverage specialist',
      department: 'Restaurant',
      hotel: 'Mountain Lodge',
      salary: 35000,
      hireDate: '2023-07-22'
    },

    // Beach Paradise Hotel Staff
    {
      id: 14,
      sl: 14,
      batchNo: 'BP-001',
      name: 'Michelle Clark',
      designation: 'Spa Manager',
      visaType: 'Employment',
      cardNo: 'EMP005001',
      issueDate: '2022-10-01',
      expireDate: '2024-10-01',
      phone: '+971-50-4560123',
      status: 'Working',
      photo: '',
      remark: 'Spa operations',
      department: 'Management',
      hotel: 'Beach Paradise Hotel',
      salary: 68000,
      hireDate: '2022-10-30'
    },
    {
      id: 15,
      sl: 15,
      batchNo: 'BP-002',
      name: 'Tony Rodriguez',
      designation: 'Lifeguard',
      visaType: 'Employment',
      cardNo: 'EMP005002',
      issueDate: '2023-08-01',
      expireDate: '2025-08-01',
      phone: '+971-50-5601234',
      status: 'Working',
      photo: '',
      remark: 'Beach safety',
      department: 'Maintenance',
      hotel: 'Beach Paradise Hotel',
      salary: 28000,
      hireDate: '2023-08-15'
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {currentPage === 'home' ? (
          <HomePage staff={staff} />
        ) : (
          <AllStaffPage staff={staff} setStaff={setStaff} />
        )}
      </div>
    </div>
  )
}

export default App
