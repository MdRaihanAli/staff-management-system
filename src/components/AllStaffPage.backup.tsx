import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'

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
  status: 'Working' | 'Jobless' | 'Exited'
  photo: string
  remark: string
  hotel: string
  department: string
  salary: number
  hireDate: string
}

interface AllStaffPageProps {
  staff: Staff[]
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
}

const AllStaffPage: React.FC<AllStaffPageProps> = ({ staff, setStaff }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExitedStaff, setShowExitedStaff] = useState(false)
  const [filterVisa, setFilterVisa] = useState('')
  const [filterHotel, setFilterHotel] = useState('')
  const [filterExpireDate, setFilterExpireDate] = useState('')

  const [newStaff, setNewStaff] = useState({
    sl: 0,
    batchNo: '',
    name: '',
    designation: '',
    visaType: '' as 'Employment' | 'Visit' | '',
    cardNo: '',
    issueDate: '',
    expireDate: '',
    phone: '',
    status: 'Working' as 'Working' | 'Jobless' | 'Exited',
    photo: '',
    remark: '',
    hotel: '',
    department: '',
    salary: 0,
    hireDate: ''
  })

  const [batchError, setBatchError] = useState('')
  const [showManageModal, setShowManageModal] = useState(false)
  const [newHotel, setNewHotel] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [bulkHotel, setBulkHotel] = useState('')
  const [bulkStatus, setBulkStatus] = useState('')
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    department: '',
    salaryMin: '',
    salaryMax: '',
    hireDate: '',
    cardNumber: ''
  })

  const [departments, setDepartments] = useState(['Manager', 'Assistant Manager', 'Supervisor', 'Staff', 'Receptionist', 'Housekeeper', 'Chef', 'Waiter', 'Security Guard', 'Maintenance Worker'])
  const [hotels, setHotels] = useState(['Grand Plaza Hotel', 'Ocean View Resort', 'City Center Inn', 'Mountain Lodge', 'Beach Paradise Hotel'])

  const addHotel = () => {
    if (newHotel.trim() && !hotels.includes(newHotel.trim())) {
      setHotels([...hotels, newHotel.trim()])
      setNewHotel('')
    }
  }

  const addDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()])
      setNewDepartment('')
    }
  }

  const removeHotel = (hotelToRemove: string) => {
    setHotels(hotels.filter(hotel => hotel !== hotelToRemove))
  }

  const removeDepartment = (deptToRemove: string) => {
    setDepartments(departments.filter(dept => dept !== deptToRemove))
  }

  const filteredStaff = staff.filter(person => {
    // Exclude exited staff from main view
    if (person.status === 'Exited') return false
    
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
    
    const matchesHireDate = searchFilters.hireDate === '' || 
      person.hireDate === searchFilters.hireDate
    
    const matchesCardNumber = searchFilters.cardNumber === '' || 
      person.cardNo.toLowerCase().includes(searchFilters.cardNumber.toLowerCase())
    
    return matchesSearch && matchesVisa && matchesHotel && matchesExpireDate &&
           matchesDepartment && matchesSalaryMin && matchesSalaryMax && 
           matchesHireDate && matchesCardNumber
  })

  const handleAddStaff = () => {
    // Check for duplicate batch number
    const duplicateBatch = staff.find(s => s.batchNo === newStaff.batchNo && newStaff.batchNo !== '')
    if (duplicateBatch) {
      setBatchError('Batch number already exists. Please use a unique batch number.')
      return
    }
    setBatchError('')

    // Only require name and designation - other fields are optional
    if (newStaff.name.trim()) {
      const newId = Math.max(...staff.map(s => s.id)) + 1
      const newSl = Math.max(...staff.map(s => s.sl)) + 1
      setStaff([...staff, { 
        ...newStaff, 
        id: newId,
        sl: newSl,
        name: newStaff.name.trim(),
        designation: newStaff.designation.trim() || 'Not Specified'
      }])
      setNewStaff({
        sl: 0,
        batchNo: '',
        name: '',
        designation: '',
        visaType: '',
        cardNo: '',
        issueDate: '',
        expireDate: '',
        phone: '',
        status: 'Working',
        photo: '',
        remark: '',
        hotel: '',
        department: '',
        salary: 0,
        hireDate: ''
      })
      setShowAddForm(false)
    }
  }

  const handleEditStaff = (updatedStaff: Staff) => {
    setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s))
    setEditingStaff(null)
  }

  const handleDeleteStaff = (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== id))
    }
  }

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(staff.map(s => ({
      'SL': s.sl,
      'Batch No': s.batchNo,
      'Name': s.name,
      'Designation': s.designation,
      'Visa Type': s.visaType,
      'Card No': s.cardNo,
      'Issue Date': s.issueDate,
      'Expire Date': s.expireDate,
      'Phone': s.phone,
      'Status': s.status,
      'Hotel': s.hotel,
      'Department': s.department,
      'Salary': s.salary,
      'Hire Date': s.hireDate,
      'Photo': s.photo,
      'Remark': s.remark
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Staff')
    XLSX.writeFile(wb, `staff_data_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Export to Word
  const exportToWord = async () => {
    const tableRows = staff.map(s => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(s.sl.toString())] }),
        new TableCell({ children: [new Paragraph(s.batchNo || '')] }),
        new TableCell({ children: [new Paragraph(s.name)] }),
        new TableCell({ children: [new Paragraph(s.designation || '')] }),
        new TableCell({ children: [new Paragraph(s.visaType || '')] }),
        new TableCell({ children: [new Paragraph(s.cardNo || '')] }),
        new TableCell({ children: [new Paragraph(s.issueDate || '')] }),
        new TableCell({ children: [new Paragraph(s.expireDate || '')] }),
        new TableCell({ children: [new Paragraph(s.phone || '')] }),
        new TableCell({ children: [new Paragraph(s.status)] }),
        new TableCell({ children: [new Paragraph(s.hotel || '')] }),
        new TableCell({ children: [new Paragraph(s.remark || '')] })
      ]
    }))

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: 'Staff Management Report',
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            text: `Generated on: ${new Date().toLocaleDateString()}`
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('SL')] }),
                  new TableCell({ children: [new Paragraph('Batch')] }),
                  new TableCell({ children: [new Paragraph('Name')] }),
                  new TableCell({ children: [new Paragraph('Designation')] }),
                  new TableCell({ children: [new Paragraph('Visa Type')] }),
                  new TableCell({ children: [new Paragraph('Card No')] }),
                  new TableCell({ children: [new Paragraph('Issue Date')] }),
                  new TableCell({ children: [new Paragraph('Expire Date')] }),
                  new TableCell({ children: [new Paragraph('Phone')] }),
                  new TableCell({ children: [new Paragraph('Status')] }),
                  new TableCell({ children: [new Paragraph('Hotel')] }),
                  new TableCell({ children: [new Paragraph('Remark')] })
                ]
              }),
              ...tableRows
            ]
          })
        ]
      }]
    })

    const buffer = await Packer.toBuffer(doc)
    saveAs(new Blob([buffer]), `staff_report_${new Date().toISOString().split('T')[0]}.docx`)
  }

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(staff, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    saveAs(dataBlob, `staff_data_${new Date().toISOString().split('T')[0]}.json`)
  }

  // Import from JSON
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (Array.isArray(data)) {
            const newStaff = data.map((item, index) => ({
              id: Math.max(...staff.map(s => s.id), 0) + index + 1,
              sl: item.sl || Math.max(...staff.map(s => s.sl), 0) + index + 1,
              batchNo: item.batchNo || '',
              name: item.name || '',
              designation: item.designation || '',
              visaType: item.visaType || '',
              cardNo: item.cardNo || '',
              issueDate: item.issueDate || '',
              expireDate: item.expireDate || '',
              phone: item.phone || '',
              status: item.status || 'Working',
              photo: item.photo || '',
              remark: item.remark || '',
              hotel: item.hotel || '',
              department: item.department || '',
              salary: item.salary || 0,
              hireDate: item.hireDate || ''
            }))
            setStaff([...staff, ...newStaff])
            alert(`Successfully imported ${newStaff.length} staff members!`)
          }
        } catch (error) {
          alert('Error importing JSON file. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  // Import from Excel
  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          const newStaff = jsonData.map((item: any, index) => ({
            id: Math.max(...staff.map(s => s.id), 0) + index + 1,
            sl: item['SL'] || item.sl || Math.max(...staff.map(s => s.sl), 0) + index + 1,
            batchNo: item['Batch No'] || item.batchNo || '',
            name: item['Name'] || item.name || '',
            designation: item['Designation'] || item.designation || '',
            visaType: item['Visa Type'] || item.visaType || '',
            cardNo: item['Card No'] || item.cardNo || '',
            issueDate: item['Issue Date'] || item.issueDate || '',
            expireDate: item['Expire Date'] || item.expireDate || '',
            phone: item['Phone'] || item.phone || '',
            status: item['Status'] || item.status || 'Working',
            photo: item['Photo'] || item.photo || '',
            remark: item['Remark'] || item.remark || '',
            hotel: item['Hotel'] || item.hotel || '',
            department: item['Department'] || item.department || '',
            salary: item['Salary'] || item.salary || 0,
            hireDate: item['Hire Date'] || item.hireDate || ''
          }))
          
          setStaff([...staff, ...newStaff])
          alert(`Successfully imported ${newStaff.length} staff members from Excel!`)
        } catch (error) {
          alert('Error importing Excel file. Please check the file format.')
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to delete ALL staff data? This action cannot be undone!')) {
      if (confirm('This will permanently delete all staff records. Are you absolutely sure?')) {
        setStaff([])
        alert('All staff data has been cleared.')
      }
    }
  }

  // Generate sample data
  const generateSampleData = () => {
    if (confirm('This will add sample staff data. Continue?')) {
      const sampleStaff = [
        {
          id: Math.max(...staff.map(s => s.id), 0) + 1,
          sl: Math.max(...staff.map(s => s.sl), 0) + 1,
          batchNo: 'B001',
          name: 'Ahmed Hassan',
          designation: 'Manager',
          visaType: 'Employment' as const,
          cardNo: 'EMP001',
          issueDate: '2024-01-01',
          expireDate: '2025-12-31',
          phone: '+971501234567',
          status: 'Working' as const,
          photo: '',
          remark: 'Senior manager',
          hotel: hotels[0] || 'Grand Plaza Hotel',
          department: 'Management',
          salary: 8000,
          hireDate: '2024-01-01'
        },
        {
          id: Math.max(...staff.map(s => s.id), 0) + 2,
          sl: Math.max(...staff.map(s => s.sl), 0) + 2,
          batchNo: 'B002',
          name: 'Sarah Johnson',
          designation: 'Receptionist',
          visaType: 'Employment' as const,
          cardNo: 'EMP002',
          issueDate: '2024-02-01',
          expireDate: '2025-12-31',
          phone: '+971507654321',
          status: 'Working' as const,
          photo: '',
          remark: 'Front desk',
          hotel: hotels[0] || 'Grand Plaza Hotel',
          department: 'Reception',
          salary: 4000,
          hireDate: '2024-02-01'
        },
        {
          id: Math.max(...staff.map(s => s.id), 0) + 3,
          sl: Math.max(...staff.map(s => s.sl), 0) + 3,
          batchNo: 'B003',
          name: 'Mohammed Ali',
          designation: 'Chef',
          visaType: 'Visit' as const,
          cardNo: 'VIS001',
          issueDate: '2024-03-01',
          expireDate: '2024-12-31',
          phone: '+971509876543',
          status: 'Jobless' as const,
          photo: '',
          remark: 'Expert in Arabic cuisine',
          hotel: hotels[1] || 'Ocean View Resort',
          department: 'Kitchen',
          salary: 5000,
          hireDate: '2024-03-01'
        }
      ]
      setStaff([...staff, ...sampleStaff])
      alert(`Added ${sampleStaff.length} sample staff members!`)
    }
  }

  // Bulk operations
  const handleBulkAction = () => {
    if (selectedStaff.length === 0) {
      alert('Please select staff members first.')
      return
    }

    switch (bulkAction) {
      case 'delete':
        if (confirm(`Delete ${selectedStaff.length} selected staff members?`)) {
          setStaff(staff.filter(s => !selectedStaff.includes(s.id)))
          setSelectedStaff([])
          alert(`Deleted ${selectedStaff.length} staff members.`)
        }
        break
      case 'changeHotel':
        if (bulkHotel) {
          setStaff(staff.map(s => 
            selectedStaff.includes(s.id) ? { ...s, hotel: bulkHotel } : s
          ))
          setSelectedStaff([])
          alert(`Updated hotel for ${selectedStaff.length} staff members.`)
        }
        break
      case 'changeStatus':
        if (bulkStatus) {
          setStaff(staff.map(s => 
            selectedStaff.includes(s.id) ? { ...s, status: bulkStatus as 'Working' | 'Jobless' | 'Exited' } : s
          ))
          setSelectedStaff([])
          alert(`Updated status for ${selectedStaff.length} staff members.`)
        }
        break
    }
    setShowBulkActions(false)
  }

  // Select/Deselect staff
  const toggleStaffSelection = (id: number) => {
    setSelectedStaff(prev => 
      prev.includes(id) 
        ? prev.filter(staffId => staffId !== id)
        : [...prev, id]
    )
  }

  const selectAllStaff = () => {
    setSelectedStaff(filteredStaff.map(s => s.id))
  }

  const deselectAllStaff = () => {
    setSelectedStaff([])
  }

  // Print functionality
  const printStaffList = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>Staff List - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .status-working { color: green; font-weight: bold; }
              .status-jobless { color: red; font-weight: bold; }
              .status-exited { color: gray; font-weight: bold; }
              .header-info { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header-info">
              <h1>🏨 Professional Hotel Staff Management</h1>
              <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Staff: ${filteredStaff.length}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Batch No</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Hotel</th>
                  <th>Phone</th>
                  <th>Visa Type</th>
                  <th>Expire Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredStaff.map(person => `
                  <tr>
                    <td>${person.sl}</td>
                    <td>${person.batchNo || 'N/A'}</td>
                    <td>${person.name}</td>
                    <td>${person.designation || 'N/A'}</td>
                    <td>${person.hotel || 'Unassigned'}</td>
                    <td>${person.phone || 'N/A'}</td>
                    <td>${person.visaType || 'N/A'}</td>
                    <td>${person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'N/A'}</td>
                    <td class="status-${person.status.toLowerCase()}">${person.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Check if showing exited staff view */}
      {showExitedStaff ? (
        // Exited Staff Full Page View
        <>
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">🚪</span>
                  Exited Staff Archive
                </h1>
                <p className="text-gray-600 mt-2">
                  Staff members who have exited (visa expired, returned to country, no longer working with us)
                </p>
              </div>
              <button
                onClick={() => setShowExitedStaff(false)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ← Back to All Staff
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{staff.filter(s => s.status === 'Exited').length}</div>
                <div className="text-sm text-gray-600">Total Exited Staff</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-800">
                  {staff.filter(s => s.status === 'Exited' && s.visaType === 'Employment').length}
                </div>
                <div className="text-sm text-orange-600">Employment Visa</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">
                  {staff.filter(s => s.status === 'Exited' && s.visaType === 'Visit').length}
                </div>
                <div className="text-sm text-purple-600">Visit Visa</div>
              </div>
            </div>
          </div>

          {/* Exited Staff Table */}
          {(() => {
            const exitedStaff = staff.filter(person => person.status === 'Exited')
            
            if (exitedStaff.length === 0) {
              return (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Exited Staff</h3>
                  <p className="text-gray-600">All staff members are currently active!</p>
                </div>
              )
            }

            return (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">📋 SL</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">🔢 Batch</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">👤 Name</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">💼 Designation</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">🏨 Hotel</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">📞 Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">🛂 Visa Type</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">⏰ Expire Date</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exitedStaff.map((person) => (
                        <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{person.sl}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{person.batchNo || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{person.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{person.designation || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{person.hotel || 'Unassigned'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{person.phone || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{person.visaType || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setViewingStaff(person)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="View Details"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => setEditingStaff(person)}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                title="Edit/Reactivate"
                              >
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-4">
                  {exitedStaff.map((person) => (
                    <div key={person.id} className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate">{person.name}</h3>
                          <p className="text-sm text-gray-600 font-semibold truncate">{person.designation || 'No designation'}</p>
                          {person.batchNo && (
                            <p className="text-xs text-gray-500 truncate">Batch: {person.batchNo}</p>
                          )}
                        </div>
                        <span className="inline-flex px-3 py-1.5 text-xs font-bold rounded-full bg-gray-100 text-gray-800 border border-gray-300 flex-shrink-0 ml-2">
                          🚪 Exited
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                          <span className="text-gray-500 font-medium">Hotel:</span>
                          <p className="font-semibold text-gray-900">{person.hotel || 'Unassigned'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Phone:</span>
                          <p className="font-semibold text-gray-900">{person.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Visa:</span>
                          <p className="font-semibold text-gray-900">{person.visaType || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Expire Date:</span>
                          <p className="font-semibold text-gray-900">
                            {person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setViewingStaff(person)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => setEditingStaff(person)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </>
      ) : (
        // Regular Staff Management View
        <>
          {/* Professional Hotel Management Header */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="mr-3 text-3xl lg:text-4xl">🏨</span>
                  Professional Hotel Staff Management
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Comprehensive staff management system for hotels and hospitality industry
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    📊 Total: {staff.length}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Working: {staff.filter(s => s.status === 'Working').length}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ❌ Jobless: {staff.filter(s => s.status === 'Jobless').length}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    🚪 Exited: {staff.filter(s => s.status === 'Exited').length}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  ➕ Add Staff
                </button>
                <button
                  onClick={() => setShowManageModal(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  ⚙️ Manage
                </button>
                <button
                  onClick={() => setShowExitedStaff(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  🚪 View Exited Staff ({staff.filter(s => s.status === 'Exited').length})
                </button>
              </div>
            </div>
          </div>

          {/* Visa Expire Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🛂</span>
              Visa Expiry Monitor - Next 2 Months
            </h2>
            
            {(() => {
              const currentDate = new Date()
              const twoMonthsFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days = 2 months
              
              const expiringVisas = staff.filter(person => 
                person.expireDate && 
                person.status !== 'Exited' &&
                new Date(person.expireDate) >= currentDate && 
                new Date(person.expireDate) <= twoMonthsFromNow
              ).sort((a, b) => new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime())

              if (expiringVisas.length === 0) {
                return (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <div className="text-green-600 text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">All Clear!</h3>
                    <p className="text-green-700">No visas expiring in the next 2 months.</p>
                  </div>
                )
              }

              return (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {expiringVisas.filter(p => new Date(p.expireDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                      </div>
                      <div className="text-sm font-medium text-red-700">Expiring This Week</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {expiringVisas.filter(p => {
                          const expDate = new Date(p.expireDate)
                          const oneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          return expDate > oneWeek && expDate <= oneMonth
                        }).length}
                      </div>
                      <div className="text-sm font-medium text-orange-700">Expiring This Month</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {expiringVisas.filter(p => {
                          const expDate = new Date(p.expireDate)
                          const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          const twoMonths = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                          return expDate > oneMonth && expDate <= twoMonths
                        }).length}
                      </div>
                      <div className="text-sm font-medium text-yellow-700">Expiring Next Month</div>
                    </div>
                  </div>

                  {/* Professional Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Staff Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Designation</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Hotel</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Visa Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Expire Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Days Remaining</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiringVisas.map((person, index) => {
                          const daysRemaining = Math.ceil((new Date(person.expireDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
                          let priorityColor = 'bg-green-100 text-green-800'
                          let priorityText = 'Low'
                          
                          if (daysRemaining <= 7) {
                            priorityColor = 'bg-red-100 text-red-800'
                            priorityText = 'Critical'
                          } else if (daysRemaining <= 30) {
                            priorityColor = 'bg-orange-100 text-orange-800'
                            priorityText = 'High'
                          } else {
                            priorityColor = 'bg-yellow-100 text-yellow-800'
                            priorityText = 'Medium'
                          }

                          return (
                            <tr key={person.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColor}`}>
                                  {priorityText}
                                </span>
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <div className="font-medium text-gray-900">{person.name}</div>
                                {person.phone && (
                                  <div className="text-sm text-gray-500">{person.phone}</div>
                                )}
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200 text-gray-700">
                                {person.designation || 'N/A'}
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200 text-gray-700">
                                {person.hotel || 'Unassigned'}
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                  {person.visaType || 'N/A'}
                                </span>
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <div className="font-medium text-gray-900">
                                  {new Date(person.expireDate).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(person.expireDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <div className={`font-semibold ${
                                  daysRemaining <= 7 ? 'text-red-600' : 
                                  daysRemaining <= 30 ? 'text-orange-600' : 'text-yellow-600'
                                }`}>
                                  {daysRemaining} days
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setEditingStaff(person)}
                                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                >
                                  ✏️ Update
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setFilterExpireDate('expiring')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      🔍 Filter by Expiring Soon
                    </button>
                    <button
                      onClick={() => exportToExcel()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      📊 Export to Excel
                    </button>
                    <button
                      onClick={() => printStaffList()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      🖨️ Print Report
                    </button>
                    <button
                      onClick={() => setFilterExpireDate('')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      🔄 Clear Filter
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Export/Import Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Data Management
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Export Options */}
              <button
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
              >
                📊 Excel
              </button>
              <button
                onClick={exportToWord}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
              >
                📄 Word
              </button>
              <button
                onClick={exportToJSON}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
              >
                💾 JSON
              </button>
              
              {/* Import Options */}
              <label className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium text-sm flex items-center justify-center cursor-pointer">
                📥 Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={importFromExcel}
                  className="hidden"
                />
              </label>
              <label className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-medium text-sm flex items-center justify-center cursor-pointer">
                📂 Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importFromJSON}
                  className="hidden"
                />
              </label>

              {/* Data Actions */}
              <button
                onClick={generateSampleData}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
              >
                🎲 Sample Data
              </button>
            </div>
          </div>

          {/* Search and Filters */}
            
            {(() => {
              const currentDate = new Date()
              const twoMonthsFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days = 2 months
              
              const expiringVisas = staff.filter(person => 
                person.expireDate && 
                person.status !== 'Exited' &&
                new Date(person.expireDate) >= currentDate && 
                new Date(person.expireDate) <= twoMonthsFromNow
              ).sort((a, b) => new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime())

              if (expiringVisas.length === 0) {
                return (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <div className="text-green-600 text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">All Clear!</h3>
                    <p className="text-green-700">No visas expiring in the next 2 months.</p>
                  </div>
                )
              }

              return (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {expiringVisas.filter(p => new Date(p.expireDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                      </div>
                      <div className="text-sm font-medium text-red-700">Expiring This Week</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {expiringVisas.filter(p => {
                          const expDate = new Date(p.expireDate)
                          const oneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          return expDate > oneWeek && expDate <= oneMonth
                        }).length}
                      </div>
                      <div className="text-sm font-medium text-orange-700">Expiring This Month</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {expiringVisas.filter(p => {
                          const expDate = new Date(p.expireDate)
                          const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          const twoMonths = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                          return expDate > oneMonth && expDate <= twoMonths
                        }).length}
                      </div>
                      <div className="text-sm font-medium text-yellow-700">Expiring Next Month</div>
                    </div>
                  </div>

                  {/* Professional Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Staff Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Designation</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Hotel</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Visa Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Expire Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Days Remaining</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiringVisas.map((person, index) => {
                          const daysRemaining = Math.ceil((new Date(person.expireDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
                          let priorityColor = 'bg-green-100 text-green-800'
                          let priorityText = 'Low'
                          
                          if (daysRemaining <= 7) {
                            priorityColor = 'bg-red-100 text-red-800'
                            priorityText = 'Critical'
                          } else if (daysRemaining <= 30) {
                            priorityColor = 'bg-orange-100 text-orange-800'
                            priorityText = 'High'
                          } else {
                            priorityColor = 'bg-yellow-100 text-yellow-800'
                            priorityText = 'Medium'
                          }

                          return (
                            <tr key={person.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColor}`}>
                                  {priorityText}
                                </span>
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <div className="font-medium text-gray-900">{person.name}</div>
                                {person.phone && (
                                  <div className="text-sm text-gray-500">{person.phone}</div>
                                )}
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200 text-gray-700">
                                {person.designation || 'N/A'}
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200 text-gray-700">
                                {person.hotel || 'Unassigned'}
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                  {person.visaType || 'N/A'}
                                </span>
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <div className="font-medium text-gray-900">
                                  {new Date(person.expireDate).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(person.expireDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                              </td>
                              <td className="py-3 px-4 border-r border-gray-200">
                                <div className={`font-semibold ${
                                  daysRemaining <= 7 ? 'text-red-600' : 
                                  daysRemaining <= 30 ? 'text-orange-600' : 'text-yellow-600'
                                }`}>
                                  {daysRemaining} days
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setEditingStaff(person)}
                                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                >
                                  ✏️ Update
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setFilterExpireDate('expiring')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      � Filter by Expiring Soon
                    </button>
                    <button
                      onClick={() => exportToExcel()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      � Export to Excel
                    </button>
                    <button
                      onClick={() => printStaffList()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      �️ Print Report
                    </button>
                    <button
                      onClick={() => setFilterExpireDate('')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      🔄 Clear Filter
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="mr-2">🔍</span>
                Search & Filters
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setAdvancedSearch(!advancedSearch)}
                  className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                    advancedSearch 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {advancedSearch ? '📊 Advanced' : '🔧 Basic'}
                </button>
                <button
                  onClick={printStaffList}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
            
            {/* Basic Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <input
                type="text"
                placeholder="🔍 Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <select
                value={filterHotel}
                onChange={(e) => setFilterHotel(e.target.value)}
                className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">🏨 All Hotels</option>
                {hotels.map(hotel => (
                  <option key={hotel} value={hotel}>{hotel}</option>
                ))}
              </select>
              <select
                value={filterVisa}
                onChange={(e) => setFilterVisa(e.target.value)}
                className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">🛂 All Visa Types</option>
                <option value="Employment">Employment</option>
                <option value="Visit">Visit</option>
              </select>
              <select
                value={filterExpireDate}
                onChange={(e) => setFilterExpireDate(e.target.value)}
                className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">⏰ All Expire Dates</option>
                <option value="expired">🔴 Expired</option>
                <option value="expiring">🟡 Expiring Soon (30 days)</option>
                <option value="valid">🟢 Valid (30+ days)</option>
              </select>
            </div>

            {/* Advanced Search */}
            {advancedSearch && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-blue-900 mb-3">🔧 Advanced Search Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="💼 Department"
                    value={searchFilters.department}
                    onChange={(e) => setSearchFilters({...searchFilters, department: e.target.value})}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="number"
                    placeholder="💰 Min Salary"
                    value={searchFilters.salaryMin}
                    onChange={(e) => setSearchFilters({...searchFilters, salaryMin: e.target.value})}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="number"
                    placeholder="💰 Max Salary"
                    value={searchFilters.salaryMax}
                    onChange={(e) => setSearchFilters({...searchFilters, salaryMax: e.target.value})}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="date"
                    placeholder="📅 Hire Date"
                    value={searchFilters.hireDate}
                    onChange={(e) => setSearchFilters({...searchFilters, hireDate: e.target.value})}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="text"
                    placeholder="🆔 Card Number"
                    value={searchFilters.cardNumber}
                    onChange={(e) => setSearchFilters({...searchFilters, cardNumber: e.target.value})}
                    className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => setSearchFilters({
                      department: '',
                      salaryMin: '',
                      salaryMax: '',
                      hireDate: '',
                      cardNumber: ''
                    })}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    🧹 Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedStaff.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-orange-900">
                    🎯 Bulk Actions ({selectedStaff.length} selected)
                  </h3>
                  <button
                    onClick={deselectAllStaff}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setBulkAction('delete')
                      setShowBulkActions(true)
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => {
                      setBulkAction('changeHotel')
                      setShowBulkActions(true)
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    🏨 Change Hotel
                  </button>
                  <button
                    onClick={() => {
                      setBulkAction('changeStatus')
                      setShowBulkActions(true)
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                  >
                    📊 Change Status
                  </button>
                </div>
              </div>
            )}

            {/* Selection Controls */}
            {filteredStaff.length > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={selectAllStaff}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    ✅ Select All ({filteredStaff.length})
                  </button>
                  {selectedStaff.length > 0 && (
                    <button
                      onClick={deselectAllStaff}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      ❌ Deselect All
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  {filteredStaff.length} staff found
                </div>
              </div>
            )}
          </div>

          {/* Staff List */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <span className="mr-2">👥</span>
              Active Staff ({filteredStaff.length})
            </h2>
            
            {filteredStaff.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No staff members found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStaff.map((person) => (
                  <div key={person.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedStaff.includes(person.id)}
                          onChange={() => toggleStaffSelection(person.id)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate">{person.name}</h3>
                          <p className="text-sm text-blue-600 font-semibold truncate">{person.designation || 'No designation'}</p>
                          {person.batchNo && (
                            <p className="text-xs text-gray-500 truncate">Batch: {person.batchNo}</p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full flex-shrink-0 ml-2 ${
                        person.status === 'Working' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {person.status === 'Working' ? '✅' : '❌'} {person.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-gray-500 font-medium">Hotel:</span>
                        <p className="font-semibold text-gray-900">{person.hotel || 'Unassigned'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Phone:</span>
                        <p className="font-semibold text-gray-900">{person.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Visa:</span>
                        <p className="font-semibold text-gray-900">{person.visaType || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Expire Date:</span>
                        {person.expireDate ? (
                          <p className={`font-semibold ${
                            new Date(person.expireDate) < new Date() 
                              ? 'text-red-600' 
                              : new Date(person.expireDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              ? 'text-orange-600'
                              : 'text-gray-900'
                          }`}>
                            {new Date(person.expireDate).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="font-semibold text-gray-900">N/A</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setViewingStaff(person)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => setEditingStaff(person)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(person.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Staff Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 flex items-center">
                  <span className="mr-2">➕</span>
                  Add New Staff Member
                </h2>
                {batchError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {batchError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="📋 Batch No (Optional)"
                    value={newStaff.batchNo}
                    onChange={(e) => setNewStaff({...newStaff, batchNo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="👤 Name *"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    placeholder="💼 Designation"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <select
                    value={newStaff.visaType}
                    onChange={(e) => setNewStaff({...newStaff, visaType: e.target.value as 'Employment' | 'Visit' | ''})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">🛂 Visa Type</option>
                    <option value="Employment">Employment</option>
                    <option value="Visit">Visit</option>
                  </select>
                  <input
                    type="text"
                    placeholder="🆔 Card No"
                    value={newStaff.cardNo}
                    onChange={(e) => setNewStaff({...newStaff, cardNo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="date"
                    placeholder="📅 Issue Date"
                    value={newStaff.issueDate}
                    onChange={(e) => setNewStaff({...newStaff, issueDate: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="date"
                    placeholder="📅 Expire Date"
                    value={newStaff.expireDate}
                    onChange={(e) => setNewStaff({...newStaff, expireDate: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="📞 Phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <select
                    value={newStaff.status}
                    onChange={(e) => setNewStaff({...newStaff, status: e.target.value as 'Working' | 'Jobless' | 'Exited'})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="Working">✅ Working</option>
                    <option value="Jobless">❌ Jobless</option>
                    <option value="Exited">🚪 Exited</option>
                  </select>
                  <select
                    value={newStaff.hotel}
                    onChange={(e) => setNewStaff({...newStaff, hotel: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">🏨 Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel} value={hotel}>{hotel}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="📷 Photo URL"
                    value={newStaff.photo}
                    onChange={(e) => setNewStaff({...newStaff, photo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="📝 Remark"
                    value={newStaff.remark}
                    onChange={(e) => setNewStaff({...newStaff, remark: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleAddStaff}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    ✅ Add Staff
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setBatchError('')
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Staff Form Modal */}
          {editingStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 flex items-center">
                  <span className="mr-2">✏️</span>
                  Edit Staff Member
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="📋 Batch No"
                    value={editingStaff.batchNo}
                    onChange={(e) => setEditingStaff({...editingStaff, batchNo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="👤 Name"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="💼 Designation"
                    value={editingStaff.designation}
                    onChange={(e) => setEditingStaff({...editingStaff, designation: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <select
                    value={editingStaff.visaType}
                    onChange={(e) => setEditingStaff({...editingStaff, visaType: e.target.value as 'Employment' | 'Visit' | ''})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">🛂 Visa Type</option>
                    <option value="Employment">Employment</option>
                    <option value="Visit">Visit</option>
                  </select>
                  <input
                    type="text"
                    placeholder="🆔 Card No"
                    value={editingStaff.cardNo}
                    onChange={(e) => setEditingStaff({...editingStaff, cardNo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="date"
                    value={editingStaff.issueDate}
                    onChange={(e) => setEditingStaff({...editingStaff, issueDate: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="date"
                    value={editingStaff.expireDate}
                    onChange={(e) => setEditingStaff({...editingStaff, expireDate: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="📞 Phone"
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({...editingStaff, status: e.target.value as 'Working' | 'Jobless' | 'Exited'})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="Working">✅ Working</option>
                    <option value="Jobless">❌ Jobless</option>
                    <option value="Exited">🚪 Exited</option>
                  </select>
                  <select
                    value={editingStaff.hotel}
                    onChange={(e) => setEditingStaff({...editingStaff, hotel: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">🏨 Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel} value={hotel}>{hotel}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="📷 Photo URL"
                    value={editingStaff.photo}
                    onChange={(e) => setEditingStaff({...editingStaff, photo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="📝 Remark"
                    value={editingStaff.remark}
                    onChange={(e) => setEditingStaff({...editingStaff, remark: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => handleEditStaff(editingStaff)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    ✅ Save Changes
                  </button>
                  <button
                    onClick={() => setEditingStaff(null)}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Staff Details Modal */}
          {viewingStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">👁️</span>
                    Staff Details
                  </h2>
                  <button
                    onClick={() => setViewingStaff(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Name:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Designation:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.designation || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Status:</span>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          viewingStaff.status === 'Working' 
                            ? 'bg-green-100 text-green-800' 
                            : viewingStaff.status === 'Exited'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {viewingStaff.status === 'Working' ? '✅' : viewingStaff.status === 'Exited' ? '🚪' : '❌'} {viewingStaff.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Contact & Work Info</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Hotel:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.hotel || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Phone:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Batch No:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.batchNo || 'Not assigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Visa Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Visa Type:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.visaType || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Card Number:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.cardNo || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Issue Date:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.issueDate ? new Date(viewingStaff.issueDate).toLocaleDateString() : 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Expire Date:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.expireDate ? new Date(viewingStaff.expireDate).toLocaleDateString() : 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Additional Info</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Photo URL:</span>
                        <p className="font-semibold text-gray-900 text-sm break-all">{viewingStaff.photo || 'No photo'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Remarks:</span>
                        <p className="font-semibold text-gray-900">{viewingStaff.remark || 'No remarks'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setViewingStaff(null)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    ✅ Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Hotels & Departments Modal */}
          {showManageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 flex items-center">
                  <span className="mr-2">⚙️</span>
                  Manage Hotels & Departments
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">🏨 Hotels</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Enter new hotel name"
                        value={newHotel}
                        onChange={(e) => setNewHotel(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addHotel()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={addHotel}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {hotels.map((hotel) => (
                        <div key={hotel} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{hotel}</span>
                          <button
                            onClick={() => removeHotel(hotel)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">💼 Departments</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Enter new department name"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={addDepartment}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{dept}</span>
                          <button
                            onClick={() => removeDepartment(dept)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowManageModal(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions Modal */}
          {showBulkActions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="mr-2">🎯</span>
                  Bulk Action
                </h2>
                
                {bulkAction === 'delete' && (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Are you sure you want to delete {selectedStaff.length} selected staff members?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleBulkAction}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                      >
                        🗑️ Delete All
                      </button>
                      <button
                        onClick={() => setShowBulkActions(false)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {bulkAction === 'changeHotel' && (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Change hotel for {selectedStaff.length} selected staff members:
                    </p>
                    <select
                      value={bulkHotel}
                      onChange={(e) => setBulkHotel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map(hotel => (
                        <option key={hotel} value={hotel}>{hotel}</option>
                      ))}
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={handleBulkAction}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        🏨 Update Hotel
                      </button>
                      <button
                        onClick={() => setShowBulkActions(false)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {bulkAction === 'changeStatus' && (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Change status for {selectedStaff.length} selected staff members:
                    </p>
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    >
                      <option value="">Select Status</option>
                      <option value="Working">✅ Working</option>
                      <option value="Jobless">❌ Jobless</option>
                      <option value="Exited">🚪 Exited</option>
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={handleBulkAction}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        📊 Update Status
                      </button>
                      <button
                        onClick={() => setShowBulkActions(false)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AllStaffPage
