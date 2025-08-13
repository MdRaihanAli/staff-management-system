import React, { useState } from 'react'
import { useStaff } from '../../contexts/StaffContext'
import { useVacations } from '../../contexts/VacationContext'
import VacationForm from '../../components/vacation/VacationForm'
import VacationList from '../../components/vacation/VacationList'
import type { VacationRequest, VacationFilters, NewVacationRequest } from '../../types/vacation'

const VacationPage: React.FC = () => {
  const { staff } = useStaff()
  const { vacations, loading, addVacationRequest, updateVacationRequest, deleteVacationRequest, getVacationStats } = useVacations()
  
  const [showForm, setShowForm] = useState(false)
  const [editingVacation, setEditingVacation] = useState<VacationRequest | null>(null)
  const [filters, setFilters] = useState<VacationFilters>({
    status: '',
    staffName: '',
    dateRange: '',
    hotel: ''
  })

  const stats = getVacationStats()

  // Filter vacations based on current filters
  const filteredVacations = vacations.filter(vacation => {
    const matchesStatus = !filters.status || vacation.status === filters.status
    const matchesStaffName = !filters.staffName || 
      vacation.staffName.toLowerCase().includes(filters.staffName.toLowerCase())
    
    const matchesHotel = !filters.hotel || (() => {
      const staffMember = staff.find(s => s.id === vacation.staffId)
      return staffMember?.hotel === filters.hotel
    })()
    
    // Date range filtering (simplified - can be enhanced)
    let matchesDateRange = true
    if (filters.dateRange) {
      const today = new Date()
      const vacationStart = new Date(vacation.startDate)
      
      switch (filters.dateRange) {
        case 'this-month':
          matchesDateRange = vacationStart.getMonth() === today.getMonth() && 
                            vacationStart.getFullYear() === today.getFullYear()
          break
        case 'next-month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
          matchesDateRange = vacationStart.getMonth() === nextMonth.getMonth() && 
                            vacationStart.getFullYear() === nextMonth.getFullYear()
          break
        case 'this-year':
          matchesDateRange = vacationStart.getFullYear() === today.getFullYear()
          break
      }
    }

    return matchesStatus && matchesStaffName && matchesHotel && matchesDateRange
  })

  const handleCreateVacation = async (newVacation: NewVacationRequest) => {
    console.log('handleCreateVacation called with:', newVacation)
    
    const staffMember = staff.find(s => s.id === newVacation.staffId)
    if (!staffMember) {
      console.error('Staff member not found for ID:', newVacation.staffId)
      return
    }

    const calculateDays = (start: string, end: string): number => {
      if (!start || !end) return 0
      const startDate = new Date(start)
      const endDate = new Date(end)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const vacation: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt'> = {
      ...newVacation,
      staffName: staffMember.name,
      staffBatch: staffMember.batchNo,
      requestDate: new Date().toISOString().split('T')[0],
      totalDays: calculateDays(newVacation.startDate, newVacation.endDate),
      status: 'Pending'
    }

    try {
      console.log('Creating vacation with data:', vacation)
      await addVacationRequest(vacation)
      setShowForm(false)
      console.log('✅ Vacation request created successfully')
    } catch (error) {
      console.error('❌ Error creating vacation request:', error)
      alert('Failed to create vacation request. Please try again.')
    }
  }

  const handleEditVacation = (vacation: VacationRequest) => {
    console.log('🖊️ Edit button clicked for vacation:', vacation)
    setEditingVacation(vacation)
    setShowForm(true)
    console.log('📝 Form should now be shown with editingVacation set')
  }

  const handleUpdateVacation = async (updatedVacation: NewVacationRequest) => {
    console.log('🔄 handleUpdateVacation called with:', updatedVacation)
    console.log('🔄 Current editingVacation:', editingVacation)
    
    if (!editingVacation) {
      console.error('❌ No editingVacation found!')
      return
    }

    const staffMember = staff.find(s => s.id === updatedVacation.staffId)
    console.log('👤 Found staff member:', staffMember)
    
    if (!staffMember) {
      console.error('❌ Staff member not found for ID:', updatedVacation.staffId)
      return
    }

    const calculateDays = (start: string, end: string): number => {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const updates: Partial<VacationRequest> = {
      ...updatedVacation,
      staffName: staffMember.name,
      staffBatch: staffMember.batchNo,
      totalDays: calculateDays(updatedVacation.startDate, updatedVacation.endDate)
    }
    
    console.log('📝 Updates to be sent:', updates)

    try {
      console.log(`🚀 Calling updateVacationRequest with ID: ${editingVacation.id}`)
      await updateVacationRequest(editingVacation.id, updates)
      setShowForm(false)
      setEditingVacation(null)
      console.log('✅ Vacation request updated successfully')
    } catch (error) {
      console.error('❌ Error updating vacation request:', error)
      alert('Failed to update vacation request. Please try again.')
    }
  }

  const handleDeleteVacation = async (id: number) => {
    if (confirm('Are you sure you want to delete this vacation request?')) {
      try {
        await deleteVacationRequest(id)
        console.log('✅ Vacation request deleted successfully')
      } catch (error) {
        console.error('❌ Error deleting vacation request:', error)
        alert('Failed to delete vacation request. Please try again.')
      }
    }
  }

  const handleUpdateStatus = async (id: number, status: VacationRequest['status'], notes?: string) => {
    const updates: Partial<VacationRequest> = {
      status,
      ...(status === 'Approved' && {
        approvedBy: 'Admin', // In real app, this would be the current user
        approvedDate: new Date().toISOString().split('T')[0]
      }),
      ...(status === 'Rejected' && notes && {
        rejectionReason: notes
      }),
      ...(status === 'Ongoing' && {
        actualStartDate: new Date().toISOString().split('T')[0]
      }),
      ...(status === 'Completed' && {
        actualEndDate: new Date().toISOString().split('T')[0]
      })
    }

    try {
      await updateVacationRequest(id, updates)
      console.log('✅ Vacation status updated successfully')
    } catch (error) {
      console.error('❌ Error updating vacation status:', error)
      alert('Failed to update vacation status. Please try again.')
    }
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      staffName: '',
      dateRange: '',
      hotel: ''
    })
  }

  const uniqueHotels = [...new Set(staff.map(s => s.hotel))].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-9 4v10a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Vacation Management</h1>
                <p className="text-slate-600 mt-1">Track staff vacation requests, approvals, and salary management</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Request</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalRequests}</p>
                  <p className="text-xs text-slate-600">Total Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendingRequests}</p>
                  <p className="text-xs text-slate-600">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.approvedRequests}</p>
                  <p className="text-xs text-slate-600">Approved</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-9 4v10a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.ongoingVacations}</p>
                  <p className="text-xs text-slate-600">Ongoing</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">${stats.totalSalaryHeld}</p>
                  <p className="text-xs text-slate-600">Salary Held</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">${stats.totalAdvanceGiven}</p>
                  <p className="text-xs text-slate-600">Advance Given</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Staff Name</label>
                <input
                  type="text"
                  value={filters.staffName}
                  onChange={(e) => setFilters(prev => ({ ...prev, staffName: e.target.value }))}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Dates</option>
                  <option value="this-month">This Month</option>
                  <option value="next-month">Next Month</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hotel</label>
                <select
                  value={filters.hotel}
                  onChange={(e) => setFilters(prev => ({ ...prev, hotel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Hotels</option>
                  {uniqueHotels.map(hotel => (
                    <option key={hotel} value={hotel}>{hotel}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-slate-600">
                Showing {filteredVacations.length} of {vacations.length} vacation requests
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Vacation List */}
        <VacationList
          vacations={filteredVacations}
          onEdit={handleEditVacation}
          onDelete={handleDeleteVacation}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Form Modal */}
        {showForm && (
          <VacationForm
            staff={staff}
            onSubmit={editingVacation ? handleUpdateVacation : handleCreateVacation}
            onCancel={() => {
              setShowForm(false)
              setEditingVacation(null)
            }}
            editingVacation={editingVacation}
          />
        )}
      </div>
    </div>
  )
}

export default VacationPage