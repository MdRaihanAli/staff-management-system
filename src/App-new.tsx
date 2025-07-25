import { useState, useEffect } from 'react'
import './App.css'
import { StaffProvider, useStaff } from './contexts/StaffContext'
import Navigation from './components/layout/Navigation'
import HomePage from './pages/Home/HomePage'
import AllStaffPage from './pages/Staff/AllStaffPage'
import type { Staff } from './types/staff'

// Sample data for initialization
const sampleStaffData: Staff[] = [
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
    name: 'Sarah Ahmed',
    designation: 'Housekeeping Supervisor',
    visaType: 'Employment',
    cardNo: 'EMP001235',
    issueDate: '2023-02-01',
    expireDate: '2025-02-01',
    phone: '+971-50-2345678',
    status: 'Working',
    photo: '',
    remark: 'Reliable and efficient',
    department: 'Housekeeping',
    hotel: 'Grand Plaza Hotel',
    salary: 45000,
    hireDate: '2023-02-15'
  },
  {
    id: 3,
    sl: 3,
    batchNo: 'OV-001',
    name: 'Mohammed Ali',
    designation: 'Chef',
    visaType: 'Employment',
    cardNo: 'EMP001236',
    issueDate: '2023-03-01',
    expireDate: '2025-03-01',
    phone: '+971-50-3456789',
    status: 'Working',
    photo: '',
    remark: 'Excellent culinary skills',
    department: 'Kitchen',
    hotel: 'Ocean View Resort',
    salary: 55000,
    hireDate: '2023-03-10'
  },
  {
    id: 4,
    sl: 4,
    batchNo: 'OV-002',
    name: 'Lisa Chen',
    designation: 'Receptionist',
    visaType: 'Visit',
    cardNo: 'VIS001001',
    issueDate: '2023-06-01',
    expireDate: '2024-06-01',
    phone: '+971-50-4567890',
    status: 'Jobless',
    photo: '',
    remark: 'Multilingual skills',
    department: 'Reception',
    hotel: 'Ocean View Resort',
    salary: 35000,
    hireDate: '2023-06-15'
  },
  {
    id: 5,
    sl: 5,
    batchNo: 'CC-001',
    name: 'Ahmed Hassan',
    designation: 'Security Guard',
    visaType: 'Employment',
    cardNo: 'EMP001237',
    issueDate: '2023-04-01',
    expireDate: '2025-04-01',
    phone: '+971-50-5678901',
    status: 'Working',
    photo: '',
    remark: 'Night shift preferred',
    department: 'Security',
    hotel: 'City Center Inn',
    salary: 30000,
    hireDate: '2023-04-20'
  },
  {
    id: 6,
    sl: 6,
    batchNo: 'ML-001',
    name: 'Robert Johnson',
    designation: 'Maintenance Worker',
    visaType: 'Employment',
    cardNo: 'EMP001238',
    issueDate: '2023-05-01',
    expireDate: '2025-05-01',
    phone: '+971-50-6789012',
    status: 'Working',
    photo: '',
    remark: 'Skilled in electrical work',
    department: 'Maintenance',
    hotel: 'Mountain Lodge',
    salary: 32000,
    hireDate: '2023-05-10'
  },
  {
    id: 7,
    sl: 7,
    batchNo: 'BP-001',
    name: 'Maria Gonzalez',
    designation: 'Waiter',
    visaType: 'Visit',
    cardNo: 'VIS001002',
    issueDate: '2023-07-01',
    expireDate: '2024-01-01',
    phone: '+971-50-7890123',
    status: 'Exited',
    photo: '',
    remark: 'Visa expired, returned home',
    department: 'Restaurant',
    hotel: 'Beach Paradise Hotel',
    salary: 25000,
    hireDate: '2023-07-15'
  },
  {
    id: 8,
    sl: 8,
    batchNo: 'BP-002',
    name: 'David Wilson',
    designation: 'Lifeguard',
    visaType: 'Employment',
    cardNo: 'EMP001239',
    issueDate: '2023-08-01',
    expireDate: '2025-08-01',
    phone: '+971-50-8901234',
    status: 'Working',
    photo: '',
    remark: 'Beach safety',
    department: 'Maintenance',
    hotel: 'Beach Paradise Hotel',
    salary: 28000,
    hireDate: '2023-08-15'
  }
]

// Inner component that uses the context
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'allstaff'>('home')
  const { staff, setStaff } = useStaff()

  // Initialize with sample data on first load
  useEffect(() => {
    if (staff.length === 0) {
      setStaff(sampleStaffData)
    }
  }, [staff.length, setStaff])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {currentPage === 'home' ? (
          <HomePage staff={staff} />
        ) : (
          <AllStaffPage />
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <StaffProvider>
      <AppContent />
    </StaffProvider>
  )
}

export default App
