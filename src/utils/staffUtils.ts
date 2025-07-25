import type { Staff, SearchFilters } from '../types/staff'

export const filterStaff = (
  staff: Staff[],
  searchTerm: string,
  filterVisa: string,
  filterHotel: string,
  filterExpireDate: string,
  searchFilters: SearchFilters,
  showExitedStaff: boolean = false
): Staff[] => {
  return staff.filter(person => {
    // Handle exited staff view
    if (showExitedStaff) {
      return person.status === 'Exited'
    } else {
      // Exclude exited staff from main view
      if (person.status === 'Exited') return false
    }
    
    // Basic search
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by visa type
    const matchesVisa = filterVisa === '' || person.visaType === filterVisa
    
    // Filter by hotel
    const matchesHotel = filterHotel === '' || person.hotel === filterHotel
    
    // Filter by expiry date
    let matchesExpireDate = true
    if (filterExpireDate) {
      const expireDate = person.expireDate ? new Date(person.expireDate) : null
      const currentDate = new Date()
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      switch (filterExpireDate) {
        case 'expired':
          matchesExpireDate = expireDate ? expireDate < currentDate : false
          break
        case 'expiring':
          matchesExpireDate = expireDate ? (expireDate >= currentDate && expireDate <= thirtyDaysFromNow) : false
          break
        case 'valid':
          matchesExpireDate = expireDate ? expireDate > thirtyDaysFromNow : false
          break
        default:
          matchesExpireDate = true
      }
    }

    // Advanced search filters
    const matchesDepartment = searchFilters.department === '' || 
      person.department.toLowerCase().includes(searchFilters.department.toLowerCase())
    
    const matchesSalaryMin = searchFilters.salaryMin === '' || 
      person.salary >= parseInt(searchFilters.salaryMin)
    
    const matchesSalaryMax = searchFilters.salaryMax === '' || 
      person.salary <= parseInt(searchFilters.salaryMax)
    
    const matchesPassportExpireDate = searchFilters.passportExpireDate === '' || 
      person.passportExpireDate === searchFilters.passportExpireDate
    
    const matchesCardNumber = searchFilters.cardNumber === '' || 
      person.cardNo.toLowerCase().includes(searchFilters.cardNumber.toLowerCase())
    
    return matchesSearch && matchesVisa && matchesHotel && matchesExpireDate &&
           matchesDepartment && matchesSalaryMin && matchesSalaryMax && 
           matchesPassportExpireDate && matchesCardNumber
  })
}

export const getStaffStats = (staff: Staff[]) => {
  const totalStaff = staff.filter(s => s.status !== 'Exited').length
  const workingStaff = staff.filter(s => s.status === 'Working').length
  const joblessStaff = staff.filter(s => s.status === 'Jobless').length
  const exitedStaff = staff.filter(s => s.status === 'Exited').length
  const employmentVisa = staff.filter(s => s.visaType === 'Employment' && s.status !== 'Exited').length
  const visitVisa = staff.filter(s => s.visaType === 'Visit' && s.status !== 'Exited').length

  return {
    totalStaff,
    workingStaff,
    joblessStaff,
    exitedStaff,
    employmentVisa,
    visitVisa
  }
}

export const generateSampleData = (currentStaff: Staff[], hotels: string[]): Staff[] => {
  return [
    {
      id: Math.max(...currentStaff.map(s => s.id), 0) + 1,
      sl: Math.max(...currentStaff.map(s => s.sl), 0) + 1,
      batchNo: 'B001',
      name: 'Ahmed Hassan',
      designation: 'Manager',
      visaType: 'Employment' as const,
      cardNo: 'EMP001',
      issueDate: '2027-01-01',
      expireDate: '2025-12-31',
      phone: '+971501234567',
      status: 'Working' as const,
      photo: '',
      remark: 'Senior manager',
      hotel: hotels[0] || 'Grand Plaza Hotel',
      department: 'Management',
      salary: 8000,
      passportExpireDate: '2027-01-01'
    },
    {
      id: Math.max(...currentStaff.map(s => s.id), 0) + 2,
      sl: Math.max(...currentStaff.map(s => s.sl), 0) + 2,
      batchNo: 'B002',
      name: 'Sarah Johnson',
      designation: 'Receptionist',
      visaType: 'Employment' as const,
      cardNo: 'EMP002',
      issueDate: '2027-02-01',
      expireDate: '2025-12-31',
      phone: '+971507654321',
      status: 'Working' as const,
      photo: '',
      remark: 'Front desk',
      hotel: hotels[0] || 'Grand Plaza Hotel',
      department: 'Reception',
      salary: 4000,
      passportExpireDate: '2027-02-01'
    },
    {
      id: Math.max(...currentStaff.map(s => s.id), 0) + 3,
      sl: Math.max(...currentStaff.map(s => s.sl), 0) + 3,
      batchNo: 'B003',
      name: 'Mohammed Ali',
      designation: 'Chef',
      visaType: 'Visit' as const,
      cardNo: 'VIS001',
      issueDate: '2027-03-01',
      expireDate: '2027-12-31',
      phone: '+971509876543',
      status: 'Jobless' as const,
      photo: '',
      remark: 'Expert in Arabic cuisine',
      hotel: hotels[1] || 'Ocean View Resort',
      department: 'Kitchen',
      salary: 5000,
      passportExpireDate: '2027-03-01'
    }
  ]
}
