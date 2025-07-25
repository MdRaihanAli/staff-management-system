import React from 'react'
import type { Staff, NewStaff } from '../../types/staff'

interface StaffFormProps {
  staff: Staff | NewStaff
  onUpdate: (field: string, value: string | number) => void
  onSave: () => void
  onCancel: () => void
  hotels: string[]
  designations?: string[]
  title: string
  isEdit?: boolean
  batchError?: string
}

const StaffForm: React.FC<StaffFormProps> = ({
  staff,
  onUpdate,
  onSave,
  onCancel,
  hotels,
  designations = [],
  title,
  isEdit = false,
  batchError
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 flex items-center">
          <span className="mr-2">{isEdit ? '✏️' : '➕'}</span>
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={staff.name}
                  onChange={(e) => onUpdate('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={staff.designation}
                  onChange={(e) => onUpdate('designation', e.target.value)}
                  list="designations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Job title"
                />
                <datalist id="designations">
                  {designations.map((designation) => (
                    <option key={designation} value={designation} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch No</label>
                <input
                  type="text"
                  value={staff.batchNo}
                  onChange={(e) => onUpdate('batchNo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    batchError 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Batch number (unique)"
                />
                {batchError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {batchError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={staff.status}
                  onChange={(e) => onUpdate('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Working">✅ Working</option>
                  <option value="Jobless">❌ Jobless</option>
                  <option value="Exited">🚪 Exited</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Work Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Contact & Work Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={staff.phone}
                  onChange={(e) => onUpdate('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+971xxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
                <select
                  value={staff.hotel}
                  onChange={(e) => onUpdate('hotel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel} value={hotel}>{hotel}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={staff.department}
                  onChange={(e) => onUpdate('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="number"
                  value={staff.salary}
                  onChange={(e) => onUpdate('salary', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Monthly salary"
                />
              </div>
            </div>
          </div>

          {/* Visa Information */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Visa Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
                <select
                  value={staff.visaType}
                  onChange={(e) => onUpdate('visaType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Visa Type</option>
                  <option value="Employment">Employment Visa</option>
                  <option value="Visit">Visit Visa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={staff.cardNo}
                  onChange={(e) => onUpdate('cardNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Emirates ID or Visa number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={staff.issueDate}
                  onChange={(e) => onUpdate('issueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expire Date</label>
                <input
                  type="date"
                  value={staff.expireDate}
                  onChange={(e) => onUpdate('expireDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">Additional Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expire Date</label>
                <input
                  type="date"
                  value={staff.passportExpireDate}
                  onChange={(e) => onUpdate('passportExpireDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={staff.photo}
                  onChange={(e) => onUpdate('photo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={staff.remark}
                  onChange={(e) => onUpdate('remark', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Additional notes or remarks"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={!!batchError}
            className={`flex-1 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg ${
              batchError 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
            }`}
          >
            {batchError ? '🚫 Fix Batch Error First' : isEdit ? '💾 Update Staff' : '➕ Add Staff'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffForm
