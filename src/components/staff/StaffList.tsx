import React from 'react'
import type { Staff } from '../../types/staff'

interface StaffListProps {
  filteredStaff: Staff[]
  selectedStaff: number[]
  onToggleSelection: (id: number) => void
  onViewStaff: (staff: Staff) => void
  onEditStaff: (staff: Staff) => void
  onDeleteStaff: (id: number) => void
}

const StaffList: React.FC<StaffListProps> = ({
  filteredStaff,
  selectedStaff,
  onToggleSelection,
  onViewStaff,
  onEditStaff,
  onDeleteStaff
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 border-b border-blue-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-3 text-2xl">👥</span>
            Staff Directory
          </h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white font-bold">{filteredStaff.length} members</span>
          </div>
        </div>
      </div>
      
      {filteredStaff.length === 0 ? (
        <div className="p-16 text-center">
          <div className="text-gray-300 text-8xl mb-6">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-3">No Staff Found</h3>
          <p className="text-gray-400">No staff members match your current filters.</p>
        </div>
      ) : (
        <div className="p-6">
          {/* Card-Table Headers */}
          <div className="mb-6 grid grid-cols-12 gap-4 items-center px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <div className="col-span-1 flex justify-center">
              <input
                type="checkbox"
                className="rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="col-span-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
              Staff Information
            </div>
            <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
              Contact Details
            </div>
            <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
              Work Assignment
            </div>
            <div className="col-span-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
              Documentation
            </div>
            <div className="col-span-1 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
              Status
            </div>
            <div className="col-span-1 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
              Actions
            </div>
          </div>

          {/* Card-Style Rows */}
          <div className="space-y-4">
            {filteredStaff.map((person) => (
              <div 
                key={person.id} 
                className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="grid grid-cols-12 gap-4 items-center p-5">
                  {/* Selection Checkbox */}
                  <div className="col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(person.id)}
                      onChange={() => onToggleSelection(person.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  
                  {/* Staff Information */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">👤</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold text-white">{person.sl}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{person.name}</h3>
                        <p className="text-sm text-gray-600 font-medium truncate">{person.designation || 'No designation'}</p>
                        {person.batchNo && (
                          <p className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                            Batch: {person.batchNo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Details */}
                  <div className="col-span-2">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center mb-2">
                        <span className="mr-2 text-green-600">📞</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {person.phone || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-purple-600">🆔</span>
                        <span className="text-xs text-gray-600 font-medium">
                          {person.cardNo || 'No card'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Work Assignment */}
                  <div className="col-span-2">
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <div className="flex items-center mb-2">
                        <span className="mr-2 text-indigo-600">🏨</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {person.hotel || 'Unassigned'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-indigo-500">🏢</span>
                        <span className="text-xs text-gray-600 font-medium">
                          {person.department || 'No department'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documentation */}
                  <div className="col-span-2">
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <div className="flex items-center mb-2">
                        <span className="mr-2 text-orange-600">🛂</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {person.visaType || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-orange-500">📅</span>
                        <span className="text-xs text-gray-600 font-medium">
                          {person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'No expiry'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1 flex justify-center">
                    <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 shadow-lg ${
                      person.status === 'Working' 
                        ? 'bg-green-50 border-green-300 text-green-700' 
                        : person.status === 'Jobless'
                        ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                        : 'bg-red-50 border-red-300 text-red-700'
                    }`}>
                      <span className="text-lg mb-1">
                        {person.status === 'Working' ? '✅' : person.status === 'Jobless' ? '⏳' : '❌'}
                      </span>
                      <span className="text-xs font-bold leading-none text-center">
                        {person.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-1 flex flex-col space-y-2">
                    <button
                      onClick={() => onViewStaff(person)}
                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                      title="View Details"
                    >
                      <span className="text-sm">👁️</span>
                    </button>
                    <button
                      onClick={() => onEditStaff(person)}
                      className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                      title="Edit Staff"
                    >
                      <span className="text-sm">✏️</span>
                    </button>
                    <button
                      onClick={() => onDeleteStaff(person.id)}
                      className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                      title="Delete Staff"
                    >
                      <span className="text-sm">🗑️</span>
                    </button>
                  </div>
                </div>
                
                {/* Additional Details Bar */}
                <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="mr-1">💰</span>
                        Salary: <span className="font-semibold ml-1">${person.salary || 'Not set'}</span>
                      </span>
                      {person.passportExpireDate && (
                        <span className="flex items-center">
                          <span className="mr-1">📕</span>
                          Passport: <span className="font-semibold ml-1">{new Date(person.passportExpireDate).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400">
                      ID: #{person.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffList
