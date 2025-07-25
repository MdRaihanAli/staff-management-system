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
    
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVisa = filterVisa === '' || person.visaType === filterVisa
    const matchesHotel = filterHotel === '' || person.hotel === filterHotel
    
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
    
    return matchesSearch && matchesVisa && matchesHotel && matchesExpireDate
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
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Staff Management Interface</h1>
          <p className="text-gray-600 mb-6">The regular staff management interface will be implemented here.</p>
          <button
            onClick={() => setShowExitedStaff(true)}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚪 View Exited Staff ({staff.filter(s => s.status === 'Exited').length})
          </button>
        </div>
      )}
    </div>
  )
}

export default AllStaffPage
