import React, { useState } from 'react'
import type { VacationRequest } from '../../types/vacation'

interface VacationListProps {
  vacations: VacationRequest[]
  onEdit: (vacation: VacationRequest) => void
  onDelete: (id: number) => void
  onUpdateStatus: (id: number, status: VacationRequest['status'], notes?: string) => void
}

const VacationList: React.FC<VacationListProps> = ({ vacations, onEdit, onDelete, onUpdateStatus }) => {
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<VacationRequest['status']>('Pending')
  const [statusNotes, setStatusNotes] = useState('')

  const getStatusColor = (status: VacationRequest['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'Ongoing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Cancelled': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: VacationRequest['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'Approved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'Rejected':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'Ongoing':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-9 4v10a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
          </svg>
        )
      case 'Completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'Cancelled':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
          </svg>
        )
      default:
        return null
    }
  }

  const handleStatusUpdate = () => {
    if (selectedVacation) {
      onUpdateStatus(selectedVacation.id, newStatus, statusNotes)
      setShowStatusModal(false)
      setSelectedVacation(null)
      setStatusNotes('')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (vacation: VacationRequest) => {
    if (vacation.status !== 'Ongoing') return false
    return new Date(vacation.endDate) < new Date()
  }

  if (vacations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a4 4 0 118 0v4m-9 4v10a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-3">No Vacation Requests</h3>
        <p className="text-gray-500">Create your first vacation request to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {vacations.map((vacation) => (
          <div
            key={vacation.id}
            className={`bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
              isOverdue(vacation) ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{vacation.staffName}</h3>
                      <p className="text-sm text-slate-600">Batch: {vacation.staffBatch}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Requested on {formatDate(vacation.requestDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center space-x-1 ${getStatusColor(vacation.status)}`}>
                      {getStatusIcon(vacation.status)}
                      <span>{vacation.status}</span>
                    </div>
                    {isOverdue(vacation) && (
                      <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        OVERDUE
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-4">
                  {/* Vacation Details */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-9 4v10a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
                      </svg>
                      Vacation Period
                    </h4>
                    <p className="text-sm text-slate-900 font-medium">{formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</p>
                    <p className="text-xs text-slate-600 mt-1">{vacation.totalDays} days</p>
                    <p className="text-xs text-slate-600">To: {vacation.destination}</p>
                  </div>

                  {/* Salary Info */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Salary Management
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900">Hold: <span className="font-medium text-red-600">${vacation.salaryHold}</span></p>
                      <p className="text-sm text-slate-900">Advance: <span className="font-medium text-green-600">${vacation.salaryAdvance}</span></p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Emergency Contact
                    </h4>
                    <p className="text-sm text-slate-900 font-medium break-all">{vacation.emergencyContact}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedVacation(vacation)
                        setNewStatus(vacation.status)
                        setShowStatusModal(true)
                      }}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => onEdit(vacation)}
                      className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(vacation.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-amber-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Reason</h4>
                  <p className="text-sm text-slate-900">{vacation.reason}</p>
                  {vacation.salaryNote && (
                    <div className="mt-2 pt-2 border-t border-amber-200">
                      <p className="text-xs text-slate-600 font-medium">Salary Note:</p>
                      <p className="text-xs text-slate-700">{vacation.salaryNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{vacation.staffName}</h3>
                  <p className="text-sm text-slate-600">Batch: {vacation.staffBatch}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(vacation.status)}`}>
                  {getStatusIcon(vacation.status)}
                  <span>{vacation.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-900">{formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</p>
                  <p className="text-xs text-slate-600">{vacation.totalDays} days • {vacation.destination}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-xs text-slate-600">Hold: <span className="font-medium text-red-600">${vacation.salaryHold}</span></p>
                    <p className="text-xs text-slate-600">Advance: <span className="font-medium text-green-600">${vacation.salaryAdvance}</span></p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-slate-600">Emergency:</p>
                    <p className="text-xs text-slate-900 font-medium truncate">{vacation.emergencyContact}</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-slate-600 font-medium mb-1">Reason:</p>
                  <p className="text-sm text-slate-900">{vacation.reason}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedVacation(vacation)
                      setNewStatus(vacation.status)
                      setShowStatusModal(true)
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onEdit(vacation)}
                    className="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(vacation.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedVacation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white">Update Vacation Status</h3>
              <p className="text-blue-100 text-sm">{selectedVacation.staffName}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as VacationRequest['status'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about the status update..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false)
                    setSelectedVacation(null)
                    setStatusNotes('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VacationList
