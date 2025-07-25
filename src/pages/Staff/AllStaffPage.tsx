import React, { useState } from 'react'
import { useStaff } from '../../contexts/StaffContext'
import { useStaffOperations } from '../../hooks/useStaffOperations'
import { filterStaff } from '../../utils/staffUtils'
import { exportToExcel, exportToWord, exportToJSON, importFromJSON, importFromExcel } from '../../utils/exportImport'
import type { SearchFilters as SearchFiltersType, NewStaff } from '../../types/staff'

// Import components
import StaffHeader from '../../components/staff/StaffHeader'
import DataManagement from '../../components/staff/DataManagement'
import SearchFilters from '../../components/staff/SearchFilters'
import StaffList from '../../components/staff/StaffList'
import StaffForm from '../../components/staff/StaffForm'

const AllStaffPage: React.FC = () => {
  const { staff, setStaff, hotels, setHotels, departments, setDepartments } = useStaff()
  const { batchError, setBatchError, addStaff, editStaff, deleteStaff, addSampleData } = useStaffOperations()
  
  // State management
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any>(null)
  const [viewingStaff, setViewingStaff] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExitedStaff, setShowExitedStaff] = useState(false)
  const [filterVisa, setFilterVisa] = useState('')
  const [filterHotel, setFilterHotel] = useState('')
  const [filterExpireDate, setFilterExpireDate] = useState('')

  const [newStaff, setNewStaff] = useState<NewStaff>({
    sl: 0,
    batchNo: '',
    name: '',
    designation: '',
    visaType: '' as const,
    cardNo: '',
    issueDate: '',
    expireDate: '',
    phone: '',
    status: 'Working' as const,
    photo: '',
    remark: '',
    hotel: '',
    department: '',
    salary: 0,
    passportExpireDate: ''
  })

  const [showManageModal, setShowManageModal] = useState(false)
  const [newHotel, setNewHotel] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [bulkHotel, setBulkHotel] = useState('')
  const [bulkStatus, setBulkStatus] = useState('')
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({
    department: '',
    salaryMin: '',
    salaryMax: '',
    passportExpireDate: '',
    cardNumber: ''
  })

  // Helper functions
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

  // Filter staff based on current view and search criteria
  const filteredStaff = filterStaff(
    staff,
    searchTerm,
    filterVisa,
    filterHotel,
    filterExpireDate,
    searchFilters,
    showExitedStaff
  )

  // Staff operations
  const handleAddStaff = () => {
    if (addStaff(newStaff)) {
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
        passportExpireDate: ''
      })
      setShowAddForm(false)
    }
  }

  const handleEditStaff = (updatedStaff: any) => {
    editStaff(updatedStaff)
    setEditingStaff(null)
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

          {/* Exited Staff List */}
          <StaffList 
            filteredStaff={filteredStaff}
            selectedStaff={selectedStaff}
            onToggleSelection={toggleStaffSelection}
            onViewStaff={setViewingStaff}
            onEditStaff={setEditingStaff}
            onDeleteStaff={deleteStaff}
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
                onAddStaff={() => setShowAddForm(true)}
                onManage={() => setShowManageModal(true)}
                onViewExited={() => setShowExitedStaff(true)}
              />
            </div>
          </div>

          {/* Enhanced Data Management */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <DataManagement 
              onExportExcel={() => exportToExcel(staff)}
              onExportWord={() => exportToWord(staff)}
              onExportJSON={() => exportToJSON(staff)}
              onImportExcel={(event) => importFromExcel(event, staff, setStaff)}
              onImportJSON={(event) => importFromJSON(event, staff, setStaff)}
              onGenerateSample={addSampleData}
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
              filterVisa={filterVisa}
              setFilterVisa={setFilterVisa}
              filterExpireDate={filterExpireDate}
              setFilterExpireDate={setFilterExpireDate}
              hotels={hotels}
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
            <div className="flex justify-between items-center mb-4">
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

          {/* Staff List */}
          <StaffList 
            filteredStaff={filteredStaff}
            selectedStaff={selectedStaff}
            onToggleSelection={toggleStaffSelection}
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
          onUpdate={(field, value) => setNewStaff({...newStaff, [field]: value})}
          onSave={handleAddStaff}
          onCancel={() => {
            setShowAddForm(false)
            setBatchError('')
          }}
          hotels={hotels}
          title="Add New Staff Member"
          batchError={batchError}
        />
      )}

      {/* Edit Staff Form Modal */}
      {editingStaff && (
        <StaffForm 
          staff={editingStaff}
          onUpdate={(field, value) => setEditingStaff({...editingStaff, [field]: value})}
          onSave={() => handleEditStaff(editingStaff)}
          onCancel={() => setEditingStaff(null)}
          hotels={hotels}
          title="Edit Staff Member"
          isEdit={true}
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
      </div>
    </div>
  )
}

export default AllStaffPage
