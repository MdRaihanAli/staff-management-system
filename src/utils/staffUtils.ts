import type { Staff, SearchFilters } from '../types/staff'

export const filterStaff = (
  staff: Staff[],
  searchTerm: string,
  filterVisa: string,
  filterHotel: string,
  filterCompany: string,
  filterDepartment: string,
  filterExpireDate: string,
  searchFilters: SearchFilters,
  showExitedStaff: boolean = false,
  filterPassportExpireDate: string = ''
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
                         person.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by visa type
    const matchesVisa = filterVisa === '' || person.visaType === filterVisa
    
    // Filter by hotel
    const matchesHotel = filterHotel === '' || person.hotel === filterHotel
    
    // Filter by company
    const matchesCompany = filterCompany === '' || person.company === filterCompany
    
    // Filter by department
    const matchesDepartment = filterDepartment === '' || person.department === filterDepartment
    
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

    // Filter by passport expiry date
    let matchesPassportExpireDate = true
    if (filterPassportExpireDate) {
      const passportExpireDate = person.passportExpireDate ? new Date(person.passportExpireDate) : null
      const currentDate = new Date()
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      switch (filterPassportExpireDate) {
        case 'expired':
          matchesPassportExpireDate = passportExpireDate ? passportExpireDate < currentDate : false
          break
        case 'expiring':
          matchesPassportExpireDate = passportExpireDate ? (passportExpireDate >= currentDate && passportExpireDate <= thirtyDaysFromNow) : false
          break
        case 'valid':
          matchesPassportExpireDate = passportExpireDate ? passportExpireDate > thirtyDaysFromNow : false
          break
        default:
          matchesPassportExpireDate = true
      }
    }

    // Advanced search filters
    const matchesAdvancedPassportExpireDate = searchFilters.passportExpireDate === '' || 
      person.passportExpireDate === searchFilters.passportExpireDate
    
    const matchesCardNumber = searchFilters.cardNumber === '' || 
      person.cardNo.toLowerCase().includes(searchFilters.cardNumber.toLowerCase())
    
    const matchesAdvancedStatus = searchFilters.status === '' || person.status === searchFilters.status
    
    return matchesSearch && matchesVisa && matchesHotel && matchesCompany && matchesDepartment && matchesExpireDate &&
           matchesPassportExpireDate && matchesAdvancedPassportExpireDate && 
           matchesCardNumber && matchesAdvancedStatus
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
      department: 'Manager',
      company: 'Hotel Management Corp',
      visaType: 'Employment' as const,
      cardNo: 'EMP001',
      issueDate: '2027-01-01',
      expireDate: '2025-12-31',
      phone: '+971501234567',
      status: 'Working' as const,
      photo: '',
      remark: 'Senior manager',
      hotel: hotels[0] || 'Grand Plaza Hotel',
      salary: 8000,
      passportExpireDate: '2027-01-01'
    },
    {
      id: Math.max(...currentStaff.map(s => s.id), 0) + 2,
      sl: Math.max(...currentStaff.map(s => s.sl), 0) + 2,
      batchNo: 'B002',
      name: 'Sarah Johnson',
      department: 'Receptionist',
      company: 'Resort Services Ltd',
      visaType: 'Employment' as const,
      cardNo: 'EMP002',
      issueDate: '2027-02-01',
      expireDate: '2025-12-31',
      phone: '+971507654321',
      status: 'Working' as const,
      photo: '',
      remark: 'Front desk',
      hotel: hotels[0] || 'Grand Plaza Hotel',
      salary: 4000,
      passportExpireDate: '2027-02-01'
    },
    {
      id: Math.max(...currentStaff.map(s => s.id), 0) + 3,
      sl: Math.max(...currentStaff.map(s => s.sl), 0) + 3,
      batchNo: 'B003',
      name: 'Mohammed Ali',
      department: 'Chef',
      company: 'Hospitality Group Inc',
      visaType: 'Visit' as const,
      cardNo: 'VIS001',
      issueDate: '2027-03-01',
      expireDate: '2027-12-31',
      phone: '+971509876543',
      status: 'Jobless' as const,
      photo: '',
      remark: 'Expert in Arabic cuisine',
      hotel: hotels[1] || 'Ocean View Resort',
      salary: 5000,
      passportExpireDate: '2027-03-01'
    }
  ]
}
