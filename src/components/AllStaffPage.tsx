import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel } from 'docx'
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
  status: 'Working' | 'Jobless'
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
  const [filterVisa, setFilterVisa] = useState('')
  const [filterHotel, setFilterHotel] = useState('')

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
    status: 'Working' as 'Working' | 'Jobless',
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
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVisa = filterVisa === '' || person.visaType === filterVisa
    const matchesHotel = filterHotel === '' || person.hotel === filterHotel
    return matchesSearch && matchesVisa && matchesHotel
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

  // Export staff data to JSON file (filtered data only)
  const handleExportData = () => {
    const exportData = filteredStaff.length > 0 ? filteredStaff : staff
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    const filterInfo = filteredStaff.length < staff.length ? '-filtered' : ''
    link.href = url
    link.download = `staff-data${filterInfo}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Import staff data from JSON file
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        
        // Validate imported data structure
        if (Array.isArray(importedData) && importedData.length > 0) {
          const validData = importedData.filter(item => 
            item && typeof item === 'object' && 
            item.name && typeof item.name === 'string'
          )
          
          if (validData.length > 0) {
            // Assign new IDs to avoid conflicts
            const maxId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) : 0
            const maxSl = staff.length > 0 ? Math.max(...staff.map(s => s.sl)) : 0
            
            const processedData = validData.map((item, index) => ({
              id: maxId + index + 1,
              sl: maxSl + index + 1,
              batchNo: item.batchNo || '',
              name: item.name || '',
              designation: item.designation || 'Not Specified',
              visaType: (['Employment', 'Visit'].includes(item.visaType) ? item.visaType : '') as 'Employment' | 'Visit' | '',
              cardNo: item.cardNo || '',
              issueDate: item.issueDate || '',
              expireDate: item.expireDate || '',
              phone: item.phone || '',
              status: (['Working', 'Jobless'].includes(item.status) ? item.status : 'Working') as 'Working' | 'Jobless',
              photo: item.photo || '',
              remark: item.remark || '',
              hotel: item.hotel || '',
              department: item.department || '',
              salary: typeof item.salary === 'number' ? item.salary : 0,
              hireDate: item.hireDate || ''
            }))
            
            if (confirm(`Import ${processedData.length} staff records? This will add to existing data.`)) {
              setStaff([...staff, ...processedData])
              alert(`Successfully imported ${processedData.length} staff records!`)
            }
          } else {
            alert('No valid staff records found in the file.')
          }
        } else {
          alert('Invalid file format. Please select a valid JSON file with staff data.')
        }
      } catch (error) {
        alert('Error reading file. Please make sure it is a valid JSON file.')
      }
    }
    reader.readAsText(file)
    
    // Reset the input value so the same file can be selected again
    event.target.value = ''
  }

  // Generate sample JSON file for users to understand the format
  const handleDownloadSample = () => {
    const sampleData = [
      {
        sl: 1,
        batchNo: "B001",
        name: "John Doe",
        designation: "Front Desk Manager",
        visaType: "Employment",
        cardNo: "ID123456",
        issueDate: "2024-01-15",
        expireDate: "2025-01-15",
        phone: "+1234567890",
        status: "Working",
        photo: "",
        remark: "Excellent performance",
        hotel: "Grand Plaza Hotel",
        department: "Front Desk",
        salary: 3500,
        hireDate: "2024-01-01"
      },
      {
        sl: 2,
        batchNo: "B002",
        name: "Jane Smith",
        designation: "Housekeeper",
        visaType: "Employment",
        cardNo: "ID123457",
        issueDate: "2024-02-01",
        expireDate: "2025-02-01",
        phone: "+1234567891",
        status: "Working",
        photo: "",
        remark: "Dedicated worker",
        hotel: "Ocean View Resort",
        department: "Housekeeping",
        salary: 2800,
        hireDate: "2024-01-15"
      }
    ]
    
    const dataStr = JSON.stringify(sampleData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sample-staff-data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Export staff data to Excel file (filtered data only)
  const handleExportExcel = () => {
    const exportData = filteredStaff.length > 0 ? filteredStaff : staff
    const ws = XLSX.utils.json_to_sheet(exportData.map(s => ({
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
      'Photo': s.photo,
      'Remark': s.remark,
      'Hotel': s.hotel,
      'Department': s.department,
      'Salary': s.salary,
      'Hire Date': s.hireDate
    })))
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Staff Data')
    const filterInfo = filteredStaff.length < staff.length ? '-filtered' : ''
    XLSX.writeFile(wb, `staff-data${filterInfo}-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Export staff data to Word document (filtered data only)
  const handleExportWord = async () => {
    const exportData = filteredStaff.length > 0 ? filteredStaff : staff
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Staff Management Report",
            heading: HeadingLevel.HEADING_1,
            alignment: 'center'
          }),
          new Paragraph({
            text: `Generated on: ${new Date().toLocaleDateString()}`,
            alignment: 'center'
          }),
          new Paragraph({
            text: filteredStaff.length < staff.length ? `Filtered Results: ${filteredStaff.length} of ${staff.length} staff` : `Total Staff: ${staff.length}`,
            alignment: 'center'
          }),
          new Paragraph({ text: "" }), // Empty line
          
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "SL", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Name", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Designation", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hotel", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Department", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Salary", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Visa Type", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Phone", bold: true })] })] }),
                ]
              }),
              ...exportData.map(s => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(s.sl.toString())] }),
                  new TableCell({ children: [new Paragraph(s.name)] }),
                  new TableCell({ children: [new Paragraph(s.designation)] }),
                  new TableCell({ children: [new Paragraph(s.hotel)] }),
                  new TableCell({ children: [new Paragraph(s.department)] }),
                  new TableCell({ children: [new Paragraph(s.salary.toString())] }),
                  new TableCell({ children: [new Paragraph(s.visaType)] }),
                  new TableCell({ children: [new Paragraph(s.status)] }),
                  new TableCell({ children: [new Paragraph(s.phone)] }),
                ]
              }))
            ]
          })
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    const filterInfo = filteredStaff.length < staff.length ? '-filtered' : ''
    saveAs(blob, `staff-report${filterInfo}-${new Date().toISOString().split('T')[0]}.docx`)
  }

  // Import staff data from Excel file
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length > 0) {
          // Assign new IDs to avoid conflicts
          const maxId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) : 0
          const maxSl = staff.length > 0 ? Math.max(...staff.map(s => s.sl)) : 0

          const processedData = jsonData.map((item: any, index) => ({
            id: maxId + index + 1,
            sl: maxSl + index + 1,
            batchNo: item['Batch No'] || item.batchNo || '',
            name: item['Name'] || item.name || '',
            designation: item['Designation'] || item.designation || 'Not Specified',
            visaType: (['Employment', 'Visit'].includes(item['Visa Type'] || item.visaType) ? 
              (item['Visa Type'] || item.visaType) : '') as 'Employment' | 'Visit' | '',
            cardNo: item['Card No'] || item.cardNo || '',
            issueDate: item['Issue Date'] || item.issueDate || '',
            expireDate: item['Expire Date'] || item.expireDate || '',
            phone: item['Phone'] || item.phone || '',
            status: (['Working', 'Jobless'].includes(item['Status'] || item.status) ? 
              (item['Status'] || item.status) : 'Working') as 'Working' | 'Jobless',
            photo: item['Photo'] || item.photo || '',
            remark: item['Remark'] || item.remark || '',
            hotel: item['Hotel'] || item.hotel || '',
            department: item['Department'] || item.department || '',
            salary: typeof (item['Salary'] || item.salary) === 'number' ? (item['Salary'] || item.salary) : 0,
            hireDate: item['Hire Date'] || item.hireDate || ''
          }))

          if (confirm(`Import ${processedData.length} staff records from Excel? This will add to existing data.`)) {
            setStaff([...staff, ...processedData])
            alert(`Successfully imported ${processedData.length} staff records from Excel!`)
          }
        } else {
          alert('No data found in the Excel file.')
        }
      } catch (error) {
        alert('Error reading Excel file. Please make sure it is a valid Excel file.')
      }
    }
    reader.readAsArrayBuffer(file)
    
    // Reset the input value
    event.target.value = ''
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="mr-2">👥</span>
          All Staff Members
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Manage all hotel staff across different properties</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          
          
          {/* Action Buttons Row */}
          <div className="flex flex-col gap-4">
            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="text-sm font-medium text-gray-700 flex items-center sm:min-w-[100px]">
                📤 Export:
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleExportData}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                >
                  JSON
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                >
                  Excel
                </button>
                <button
                  onClick={handleExportWord}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                >
                  Word
                </button>
              </div>
            </div>

            {/* Import Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="text-sm font-medium text-gray-700 flex items-center sm:min-w-[100px]">
                📥 Import:
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <label className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-center text-xs sm:text-sm">
                  JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
                <label className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-center text-xs sm:text-sm">
                  Excel
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImportExcel}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Add New Staff and Manage Button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
              <button
                onClick={() => setShowManageModal(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                ⚙️ Manage Hotels & Designations
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                ➕ Add New Staff
              </button>
            </div>
          </div>
          
          {/* Import/Export Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 text-sm sm:text-base">💡</span>
                <div className="text-xs sm:text-sm text-blue-700">
                  <p className="font-medium mb-1">Import/Export Options:</p>
                  <p>• <strong>Export:</strong> JSON (backup), Excel (.xlsx), Word (.docx) report</p>
                  <p>• <strong>Smart Export:</strong> Exports filtered data when filters are applied, otherwise exports all data</p>
                  <p>• <strong>Import:</strong> JSON files, Excel files (.xlsx/.xls)</p>
                  <p>• <strong>Sample:</strong> Download sample file to see the expected format</p>
                </div>
              </div>
              <button
                onClick={handleDownloadSample}
                className="text-xs sm:text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
              >
                📄 Download Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Staff Form */}
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
              {/* Row 1 */}
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
                list="designations-list"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <datalist id="designations-list">
                {departments.map(dept => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
              
              {/* Row 2 */}
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
              
              {/* Row 3 */}
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
                onChange={(e) => setNewStaff({...newStaff, status: e.target.value as 'Working' | 'Jobless'})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="Working">✅ Working</option>
                <option value="Jobless">❌ Jobless</option>
              </select>
              
              {/* Row 4 */}
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
              
              {/* Row 5 */}
              <input
                type="date"
                placeholder="📅 Hire Date"
                value={newStaff.hireDate}
                onChange={(e) => setNewStaff({...newStaff, hireDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
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
            <div className="mt-4 text-sm text-gray-600">
              <p>* Required fields: Name only</p>
              <p>• All other fields are optional</p>
              <p>• Batch numbers must be unique</p>
            </div>
          </div>
        </div>
      )}

      {/* Manage Hotels & Designations Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 flex items-center">
              <span className="mr-2">⚙️</span>
              Manage Hotels & Designations
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hotels Management */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-2">🏨</span>
                  Hotels
                </h3>
                
                {/* Add New Hotel */}
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
                
                {/* Hotels List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {hotels.map((hotel) => (
                    <div key={hotel} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{hotel}</span>
                      <button
                        onClick={() => removeHotel(hotel)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Remove hotel"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Designations Management */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-2">�</span>
                  Designations
                </h3>
                
                {/* Add New Designation */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter new designation name"
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
                
                {/* Designations List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{dept}</span>
                      <button
                        onClick={() => removeDepartment(dept)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Remove designation"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowManageModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Search and Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
              <option value="">� All Visa Types</option>
              <option value="Employment">Employment</option>
              <option value="Visit">Visit</option>
            </select>
          </div>

      {/* Edit Staff Form */}
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
                list="designations-edit-list"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <datalist id="designations-edit-list">
                {departments.map(dept => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
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
                placeholder="📅 Issue Date"
                value={editingStaff.issueDate}
                onChange={(e) => setEditingStaff({...editingStaff, issueDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <input
                type="date"
                placeholder="📅 Expire Date"
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
                onChange={(e) => setEditingStaff({...editingStaff, status: e.target.value as 'Working' | 'Jobless'})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="Working">✅ Working</option>
                <option value="Jobless">❌ Jobless</option>
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
                type="date"
                placeholder="📅 Hire Date"
                value={editingStaff.hireDate}
                onChange={(e) => setEditingStaff({...editingStaff, hireDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
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

      {/* Staff Details Modal */}
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
              {/* Basic Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">👤</span>
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Serial Number:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.sl}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Batch Number:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.batchNo || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Full Name:</span>
                    <p className="font-semibold text-gray-900 text-lg">{viewingStaff.name}</p>
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
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingStaff.status === 'Working' ? '✅' : '❌'} {viewingStaff.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <span className="mr-2">🏢</span>
                  Work Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Hotel:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.hotel || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Department:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.department || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Salary:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.salary ? `$${viewingStaff.salary.toLocaleString()}` : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Hire Date:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.hireDate ? new Date(viewingStaff.hireDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Visa & Documentation */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                  <span className="mr-2">🛂</span>
                  Visa & Documentation
                </h3>
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

              {/* Contact & Additional Info */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                  <span className="mr-2">📞</span>
                  Contact & Additional
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Phone Number:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.phone || 'Not provided'}</p>
                  </div>
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

      {/* Hotel-wise Staff Organization */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <span className="mr-2">🏨</span>
          Staff by Hotel
        </h2>
        
        {hotels.map(hotel => {
          const hotelStaff = filteredStaff.filter(person => person.hotel === hotel)
          if (hotelStaff.length === 0) return null
          
          return (
            <div key={hotel} className="mb-6 last:mb-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
                  <h3 className="text-lg font-semibold flex items-center justify-between">
                    <span>{hotel}</span>
                    <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
                      {hotelStaff.length} staff
                    </span>
                  </h3>
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">📋 SL</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">🔢 Batch</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">👤 Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">💼 Designation</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"> Phone</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">🛂 Visa</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">📊 Status</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hotelStaff.map((person) => (
                        <tr key={person.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{person.sl}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{person.batchNo || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{person.designation || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{person.phone || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{person.visaType || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              person.status === 'Working' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {person.status === 'Working' ? '✅' : '❌'} {person.status}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setViewingStaff(person)}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                title="View Details"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => setEditingStaff(person)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Edit Staff"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(person.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Delete Staff"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                  <div className="p-4 space-y-4">
                    {hotelStaff.map((person) => (
                      <div key={person.id} className="bg-gradient-to-r from-white to-blue-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{person.name}</h3>
                            <p className="text-sm text-blue-600 font-medium truncate">{person.designation || 'No designation'}</p>
                            {person.batchNo && (
                              <p className="text-xs text-gray-500 truncate">Batch: {person.batchNo}</p>
                            )}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                            person.status === 'Working' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {person.status === 'Working' ? '✅' : '❌'} {person.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-500 w-16 sm:w-20 flex-shrink-0">📞 Phone:</span>
                            <span className="text-gray-900 truncate">{person.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 w-16 sm:w-20 flex-shrink-0">🛂 Visa:</span>
                            <span className="text-gray-900 truncate">{person.visaType || 'N/A'}</span>
                          </div>
                          {person.remark && (
                            <div className="flex items-start">
                              <span className="text-gray-500 w-16 sm:w-20 flex-shrink-0">📝 Note:</span>
                              <span className="text-gray-900 text-xs break-words">{person.remark}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Mobile Action Buttons */}
                        <div className="flex gap-1 mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => setViewingStaff(person)}
                            className="flex-1 bg-green-500 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => setEditingStaff(person)}
                            className="flex-1 bg-blue-500 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(person.id)}
                            className="flex-1 bg-red-500 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredStaff.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No staff members found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default AllStaffPage