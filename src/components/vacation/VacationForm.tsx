import React, { useState } from 'react'
import type { Staff } from '../../types/staff'
import type { NewVacationRequest } from '../../types/vacation'

interface VacationFormProps {
  staff: Staff[]
  onSubmit: (vacation: NewVacationRequest) => void
  onCancel: () => void
  editingVacation?: any // This will hold the vacation being edited
}

const VacationForm: React.FC<VacationFormProps> = ({ staff, onSubmit, onCancel, editingVacation }) => {
  // Helper function to get a valid staff ID
  const getValidStaffId = (targetId?: number): number => {
    if (!targetId) return 0
    
    // Check if the target ID exists in current staff list
    const staffExists = staff.find(s => s.id === targetId)
    if (staffExists) return targetId
    
    // If editing vacation has invalid staff ID, try to find by name
    if (editingVacation?.staffName) {
      const staffByName = staff.find(s => s.name === editingVacation.staffName)
      if (staffByName) {
        console.warn(`⚠️ Staff ID ${targetId} not found, using ID ${staffByName.id} for ${editingVacation.staffName}`)
        return staffByName.id
      }
    }
    
    console.warn(`⚠️ Could not find valid staff ID for ${targetId}, defaulting to 0`)
    return 0
  }

  const [formData, setFormData] = useState<NewVacationRequest>({
    staffId: getValidStaffId(editingVacation?.staffId),
    startDate: editingVacation?.startDate || '',
    endDate: editingVacation?.endDate || '',
    reason: editingVacation?.reason || '',
    salaryHold: editingVacation?.salaryHold || 0,
    salaryAdvance: editingVacation?.salaryAdvance || 0,
    salaryNote: editingVacation?.salaryNote || '',
    emergencyContact: editingVacation?.emergencyContact || '',
    destination: editingVacation?.destination || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate days remaining until return
  const calculateDaysRemaining = (endDate: string): number => {
    if (!endDate) return 0
    const today = new Date()
    const returnDate = new Date(endDate)
    const diffTime = returnDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Calculate total vacation days
  const calculateTotalDays = (start: string, end: string): number => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const daysRemaining = calculateDaysRemaining(formData.endDate)
  const totalDays = calculateTotalDays(formData.startDate, formData.endDate)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Only staff name is required
    if (!formData.staffId || formData.staffId === 0) {
      newErrors.staffId = 'Please select a staff member'
    }

    // Optional validations only if values are provided
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (start > end) {
        newErrors.endDate = 'End date must be after start date'
      }
      // Remove past date validation to make it more flexible
    }

    if (formData.salaryHold < 0) newErrors.salaryHold = 'Salary hold cannot be negative'
    if (formData.salaryAdvance < 0) newErrors.salaryAdvance = 'Salary advance cannot be negative'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 VacationForm: Form submitted')
    console.log('📝 VacationForm: Current formData:', formData)
    console.log('📝 VacationForm: editingVacation:', editingVacation)
    
    if (validateForm()) {
      console.log('✅ VacationForm: Form validation passed, calling onSubmit')
      onSubmit(formData)
    } else {
      console.log('❌ VacationForm: Form validation failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'staffId' 
        ? Number(value) || 0
        : name === 'salaryHold' || name === 'salaryAdvance' 
        ? Number(value) || 0
        : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-4 py-3 bg-blue-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {editingVacation ? 'Edit Vacation Request' : 'Vacation Request'}
            </h2>
            <button
              onClick={onCancel}
              className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Staff Selection - Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Member *
            </label>
            <select
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.staffId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Choose staff member</option>
              {staff.filter(s => s.status === 'Working').map(person => (
                <option key={person.id} value={person.id}>
                  {person.name} - {person.department}
                </option>
              ))}
            </select>
            {errors.staffId && <p className="text-red-500 text-xs mt-1">{errors.staffId}</p>}
          </div>

          {/* Optional Fields in Compact Layout */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Days calculation display */}
          {(formData.startDate && formData.endDate) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Total Days: <span className="font-semibold text-blue-600">{totalDays}</span>
                  </span>
                </div>
                {daysRemaining > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Days Left: <span className="font-semibold text-green-600">{daysRemaining}</span>
                    </span>
                  </div>
                )}
                {daysRemaining === 0 && new Date(formData.endDate) < new Date() && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Status: <span className="font-semibold text-gray-600">Completed</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hold ($)</label>
              <input
                type="number"
                name="salaryHold"
                value={formData.salaryHold}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Advance ($)</label>
              <input
                type="number"
                name="salaryAdvance"
                value={formData.salaryAdvance}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={2}
              placeholder="Optional"
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-dark rounded hover:bg-blue-700"
            >
              {editingVacation ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VacationForm
