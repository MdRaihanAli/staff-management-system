import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { useStaff } from '../../contexts/StaffContext'
import { useStaffOperations } from '../../hooks/useStaffOperations'
import { filterStaff } from '../../utils/staffUtils'
import { exportToWord, exportToJSON, importFromJSON, importFromExcel } from '../../utils/exportImport'
import type { SearchFilters as SearchFiltersType, NewStaff } from '../../types/staff'

// Import components
import StaffHeader from '../../components/staff/StaffHeader'
import DataManagement from '../../components/staff/DataManagement'
import SearchFilters from '../../components/staff/SearchFilters'
import StaffList from '../../components/staff/StaffList'
import StaffForm from '../../components/staff/StaffForm'

const AllStaffPage: React.FC = () => {
  const { staff, setStaff, hotels, setHotels, companies, setCompanies, departments, setDepartments } = useStaff()
  const { batchError, setBatchError, addStaff, editStaff, deleteStaff } = useStaffOperations()
  
  // State management
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any>(null)
  const [viewingStaff, setViewingStaff] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExitedStaff, setShowExitedStaff] = useState(false)
  const [filterVisa, setFilterVisa] = useState('')
  const [filterHotel, setFilterHotel] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterExpireDate, setFilterExpireDate] = useState('')
  const [filterPassportExpireDate, setFilterPassportExpireDate] = useState('')

  const [newStaff, setNewStaff] = useState<NewStaff>({
    sl: 0,
    batchNo: '',
    name: '',
    department: '',
    company: '',
    visaType: '' as const,
    cardNo: '',
    issueDate: '',
    expireDate: '',
    phone: '',
    status: 'Working' as const,
    photo: '',
    remark: '',
    hotel: '',
    salary: 0,
    passportExpireDate: ''
  })

  const [showManageModal, setShowManageModal] = useState(false)
  const [newHotel, setNewHotel] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [bulkHotel, setBulkHotel] = useState('')
  const [bulkStatus, setBulkStatus] = useState('')
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({
    passportExpireDate: '',
    cardNumber: '',
    status: ''
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Helper functions
  const addHotel = () => {
    if (newHotel.trim() && !hotels.includes(newHotel.trim())) {
      setHotels([...hotels, newHotel.trim()])
      setNewHotel('')
    }
  }

  const removeHotel = (hotelToRemove: string) => {
    setHotels(hotels.filter(hotel => hotel !== hotelToRemove))
  }

  const addCompany = () => {
    if (newCompany.trim() && !companies.includes(newCompany.trim())) {
      setCompanies([...companies, newCompany.trim()])
      setNewCompany('')
    }
  }

  const removeCompany = (companyToRemove: string) => {
    setCompanies(companies.filter(company => company !== companyToRemove))
  }

  const addDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()])
      setNewDepartment('')
    }
  }

  const removeDepartment = (departmentToRemove: string) => {
    setDepartments(departments.filter(department => department !== departmentToRemove))
  }

  // Helper functions to handle field updates with batch error clearing
  const handleNewStaffUpdate = (field: string, value: string | number) => {
    if (field === 'batchNo') {
      setBatchError('') // Clear batch error when user starts typing
    }
    setNewStaff({...newStaff, [field]: value})
  }

  const handleEditStaffUpdate = (field: string, value: string | number) => {
    if (field === 'batchNo') {
      setBatchError('') // Clear batch error when user starts typing
    }
    setEditingStaff({...editingStaff, [field]: value})
  }

  // Filter staff based on current view and search criteria
  const filteredStaff = filterStaff(
    staff,
    searchTerm,
    filterVisa,
    filterHotel,
    filterCompany,
    filterDepartment,
    filterExpireDate,
    searchFilters,
    showExitedStaff,
    filterPassportExpireDate
  )

  // Export helper functions - export based on current view
  const getExportData = () => {
    if (showExitedStaff) {
      // When viewing exited staff, export only exited staff
      return staff.filter(person => person.status === 'Exited')
    } else {
      // When viewing all staff, export only non-exited staff (Working and Jobless)
      return staff.filter(person => person.status !== 'Exited')
    }
  }

  const handleExportExcel = () => {
    // Export filtered data instead of all data
    const exportData = filteredStaff
    // Create a custom export function with appropriate filename
    const ws = XLSX.utils.json_to_sheet(exportData.map((s: any) => ({
      'SL': s.sl,
      'Batch No': s.batchNo,
      'Name': s.name,
      'Department': s.department,
      'Company': s.company,
      'Visa Type': s.visaType,
      'Card No': s.cardNo,
      'Issue Date': s.issueDate,
      'Expire Date': s.expireDate,
      'Phone': s.phone,
      'Status': s.status,
      'Hotel': s.hotel,
      'Salary': s.salary,
      'Passport Expire Date': s.passportExpireDate,
      'Photo': s.photo,
      'Remark': s.remark
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Staff')
    const filename = showExitedStaff 
      ? `filtered_exited_staff_${new Date().toISOString().split('T')[0]}.xlsx`
      : `filtered_staff_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, filename)
  }

  const handleExportWord = () => {
    // Export filtered data instead of all data
    const exportData = filteredStaff
    exportToWord(exportData)
  }

  const handleExportJSON = () => {
    // Export filtered data instead of all data
    const exportData = filteredStaff
    exportToJSON(exportData)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex)

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page)
    setSelectedStaff([]) // Clear selections when changing page
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  // Reset to first page when search filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterVisa, filterHotel, filterCompany, filterDepartment, filterExpireDate, filterPassportExpireDate, showExitedStaff, searchFilters])

  // Staff operations
  const handleAddStaff = () => {
    if (addStaff(newStaff)) {
      setNewStaff({
        sl: 0,
        batchNo: '',
        name: '',
        department: '',
        company: '',
        visaType: '',
        cardNo: '',
        issueDate: '',
        expireDate: '',
        phone: '',
        status: 'Working',
        photo: '',
        remark: '',
        hotel: '',
        salary: 0,
        passportExpireDate: ''
      })
      setShowAddForm(false)
    }
  }

  const handleEditStaff = (updatedStaff: any) => {
    if (editStaff(updatedStaff)) {
      setEditingStaff(null)
    }
    // If editStaff returns false, keep the modal open to show batch error
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
            selectedStaff.includes(s.id) ? { ...s, status: bulkStatus as any } : s
          ))
          setSelectedStaff([])
          alert(`Updated status for ${selectedStaff.length} staff members.`)
        }
        break
    }
    setShowBulkActions(false)
  }

  // Selection functions
  const toggleStaffSelection = (id: number) => {
    setSelectedStaff(prev => 
      prev.includes(id) 
        ? prev.filter(staffId => staffId !== id)
        : [...prev, id]
    )
  }

  const selectAllStaff = () => {
    setSelectedStaff(paginatedStaff.map(s => s.id))
  }

  const deselectAllStaff = () => {
    setSelectedStaff([])
  }

  // Print functionality
  const printStaffList = () => {
    // Print filtered data instead of all data
    const printData = filteredStaff
    const printTitle = showExitedStaff ? 'Filtered Exited Staff Archive' : 'Filtered Staff Management'
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>${printTitle} - ${new Date().toLocaleDateString()}</title>
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
              <h1>🏨 ${printTitle}</h1>
              <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Filtered Results: ${printData.length} staff</p>
              <p><em>This report shows only the staff matching your current search and filter criteria</em></p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Batch No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Company</th>
                  <th>Hotel</th>
                  <th>Phone</th>
                  <th>Visa Type</th>
                  <th>Expire Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${printData.map(person => `
                  <tr>
                    <td>${person.sl}</td>
                    <td>${person.batchNo || 'N/A'}</td>
                    <td>${person.name}</td>
                    <td>${person.department || 'N/A'}</td>
                    <td>${person.company || 'N/A'}</td>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Check if showing exited staff view */}
        {showExitedStaff ? (
          // Exited Staff Full Page View
          <>
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-gray-700 via-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                      <span className="mr-3 text-3xl">🚪</span>
                      Exited Staff Archive
                    </h1>
                    <p className="text-gray-200 mt-2">
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
            </div>

          {/* Data Management for Exited Staff */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <DataManagement 
              onExportExcel={handleExportExcel}
              onExportWord={handleExportWord}
              onExportJSON={handleExportJSON}
              onImportExcel={(event) => importFromExcel(event, staff, setStaff)}
              onImportJSON={(event) => importFromJSON(event, staff, setStaff)}
              onAddStaff={() => setShowAddForm(true)}
              onManage={() => setShowManageModal(true)}
              onViewExited={() => setShowExitedStaff(false)}
            />
          </div>

          {/* Bulk Actions for Exited Staff */}
          {selectedStaff.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-900">
                  🗑️ Exited Staff Actions ({selectedStaff.length} selected)
                </h3>
                <button
                  onClick={deselectAllStaff}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Permanently delete ${selectedStaff.length} selected exited staff members?\n\nThis action cannot be undone.`)) {
                      setStaff(staff.filter(s => !selectedStaff.includes(s.id)))
                      setSelectedStaff([])
                      alert(`Deleted ${selectedStaff.length} exited staff members.`)
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  🗑️ Delete Selected
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Change ${selectedStaff.length} selected staff back to Working status?`)) {
                      setStaff(staff.map(s => 
                        selectedStaff.includes(s.id) ? { ...s, status: 'Working' as any } : s
                      ))
                      setSelectedStaff([])
                      alert(`Changed ${selectedStaff.length} staff back to Working status.`)
                    }
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                >
                  ↩️ Restore to Working
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls for Exited Staff */}
          {filteredStaff.length > itemsPerPage && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>

                {/* Page info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredStaff.length)} of {filteredStaff.length} exited staff
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed border-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-700'
                    }`}
                  >
                    ← Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed border-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-700'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exited Staff List */}
          <StaffList 
            filteredStaff={paginatedStaff}
            selectedStaff={selectedStaff}
            onToggleSelection={toggleStaffSelection}
            onViewStaff={setViewingStaff}
            onEditStaff={setEditingStaff}
            onDeleteStaff={deleteStaff}
            onSelectAll={selectAllStaff}
            onDeselectAll={deselectAllStaff}
          />
        </>
      ) : (
        // Regular Staff Management View
        <>
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <StaffHeader 
                staff={filteredStaff}
              />
            </div>
          </div>

          {/* Enhanced Data Management */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <DataManagement 
              onExportExcel={handleExportExcel}
              onExportWord={handleExportWord}
              onExportJSON={handleExportJSON}
              onImportExcel={(event) => importFromExcel(event, staff, setStaff)}
              onImportJSON={(event) => importFromJSON(event, staff, setStaff)}
              onAddStaff={() => setShowAddForm(true)}
              onManage={() => setShowManageModal(true)}
              onViewExited={() => setShowExitedStaff(true)}
            />
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <SearchFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterHotel={filterHotel}
              setFilterHotel={setFilterHotel}
              filterCompany={filterCompany}
              setFilterCompany={setFilterCompany}
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              filterVisa={filterVisa}
              setFilterVisa={setFilterVisa}
              filterExpireDate={filterExpireDate}
              setFilterExpireDate={setFilterExpireDate}
              filterPassportExpireDate={filterPassportExpireDate}
              setFilterPassportExpireDate={setFilterPassportExpireDate}
              hotels={hotels}
              companies={companies}
              departments={departments}
              advancedSearch={advancedSearch}
              setAdvancedSearch={setAdvancedSearch}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              onPrint={printStaffList}
            />
          </div>

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
                  className="px-3 py-1 bg-red-500 text-zinc-800 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => {
                    setBulkAction('changeHotel')
                    setShowBulkActions(true)
                  }}
                  className="px-3 py-1 bg-blue-600 text-zinc-800 rounded text-xs font-medium hover:bg-blue-700 transition-colors border border-blue-700"
                >
                  🏨 Change Hotel
                </button>
                <button
                  onClick={() => {
                    setBulkAction('changeStatus')
                    setShowBulkActions(true)
                  }}
                  className="px-3 py-1 bg-green-500 text-zinc-800 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                >
                  📊 Change Status
                </button>
              </div>
            </div>
          )}

          {/* Selection Controls */}
          {filteredStaff.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectAllStaff}
                    className="px-4 py-2 text-sm bg-blue-600 text-zinc-800 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg border border-blue-700"
                  >
                    ✅ Select All on Page ({paginatedStaff.length})
                  </button>
                  {selectedStaff.length > 0 && (
                    <button
                      onClick={deselectAllStaff}
                      className="px-4 py-2 text-sm bg-slate-600  text-zinc-800 rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg border border-slate-700"
                    >
                      ❌ Deselect All
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {selectedStaff.length > 0 && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold border border-green-300">
                      🎯 {selectedStaff.length} selected
                    </div>
                  )}
                  <div className="text-sm text-blue-700 font-semibold">
                    📊 {filteredStaff.length} total staff • Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredStaff.length > itemsPerPage && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                    <option value={500}>500 per page</option>
                    <option value={1000}>1000 per page</option>
                  </select>
                </div>

                {/* Page info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredStaff.length)} of {filteredStaff.length} staff
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed border-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-700'
                    }`}
                  >
                    ← Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed border-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-700'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Staff List */}
          <StaffList 
            filteredStaff={paginatedStaff}
            selectedStaff={selectedStaff}
            onToggleSelection={toggleStaffSelection}
            onSelectAll={selectAllStaff}
            onDeselectAll={deselectAllStaff}
            onViewStaff={setViewingStaff}
            onEditStaff={setEditingStaff}
            onDeleteStaff={deleteStaff}
          />
        </>
      )}

      {/* Add Staff Form Modal */}
      {showAddForm && (
        <StaffForm 
          staff={newStaff}
          onUpdate={handleNewStaffUpdate}
          onSave={handleAddStaff}
          onCancel={() => {
            setShowAddForm(false)
            setBatchError('')
          }}
          hotels={hotels}
          departments={departments}
          companies={companies}
          title="Add New Staff Member"
          batchError={batchError}
        />
      )}

      {/* Edit Staff Form Modal */}
      {editingStaff && (
        <StaffForm 
          staff={editingStaff}
          onUpdate={handleEditStaffUpdate}
          onSave={() => handleEditStaff(editingStaff)}
          onCancel={() => {
            setEditingStaff(null)
            setBatchError('')
          }}
          hotels={hotels}
          departments={departments}
          companies={companies}
          title="Edit Staff Member"
          isEdit={true}
          batchError={batchError}
        />
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
                    <span className="text-gray-600 text-sm">Department:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Company:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.company || 'Not specified'}</p>
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
                <h3 className="text-lg font-semibold text-purple-900 mb-3">🛂 Visa & Passport Information</h3>
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
                    <span className="text-gray-600 text-sm">Visa Issue Date:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.issueDate ? new Date(viewingStaff.issueDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Visa Expire Date:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.expireDate ? new Date(viewingStaff.expireDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Passport Expire Date:</span>
                    <p className="font-semibold text-gray-900">{viewingStaff.passportExpireDate ? new Date(viewingStaff.passportExpireDate).toLocaleDateString() : 'Not specified'}</p>
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

      {/* Manage Hotels Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 flex items-center">
              <span className="mr-2">⚙️</span>
              Manage System Data
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hotels Section */}
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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

              {/* Companies Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🏢 Companies</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter new company name"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCompany()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={addCompany}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {companies.map((company) => (
                    <div key={company} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{company}</span>
                      <button
                        onClick={() => removeCompany(company)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departments Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🏛️ Departments</h3>
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
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {departments.map((department) => (
                    <div key={department} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{department}</span>
                      <button
                        onClick={() => removeDepartment(department)}
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
                    className="flex-1 bg-red-500 text-red-500 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    🗑️ Delete All
                  </button>
                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="flex-1 bg-gray-500 text-zinc-800 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
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
                    className="flex-1 bg-blue-600 text-emerald-700 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-700"
                  >
                    🏨 Update Hotel
                  </button>
                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="flex-1 bg-gray-500 text-red-500 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
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
                    className="flex-1 bg-green-500 text-emerald-800 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    📊 Update Status
                  </button>
                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="flex-1 bg-gray-500 text-red-600 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default AllStaffPage
