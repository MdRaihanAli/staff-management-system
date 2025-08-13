import React from 'react'
import type { Staff } from '../../types/staff'

interface StaffListProps {
  filteredStaff: Staff[]
  selectedStaff: number[]
  onToggleSelection: (id: number) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onViewStaff: (staff: Staff) => void
  onEditStaff: (staff: Staff) => void
  onDeleteStaff: (id: number | string) => void
}

const StaffList: React.FC<StaffListProps> = ({
  filteredStaff,
  selectedStaff,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onViewStaff,
  onEditStaff,
  onDeleteStaff
}) => {
  const allSelected = filteredStaff.length > 0 && selectedStaff.length === filteredStaff.length
  const someSelected = selectedStaff.length > 0 && selectedStaff.length < filteredStaff.length

  const handleMasterCheckbox = () => {
    if (allSelected) {
      onDeselectAll()
    } else {
      onSelectAll()
    }
  }
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      {/* Professional Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white">Staff Management</h2>
              <p className="text-slate-300 text-xs md:text-sm hidden md:block">Employee Directory & Information</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {selectedStaff.length > 0 && (
              <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl px-3 md:px-5 py-2 md:py-2.5 border border-emerald-400/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-100 font-semibold text-xs md:text-sm">
                    {selectedStaff.length} Selected
                  </span>
                </div>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 md:px-5 py-2 md:py-2.5 border border-white/20">
              <div className="flex items-center space-x-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span className="text-white font-semibold text-xs md:text-sm">{filteredStaff.length} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {filteredStaff.length === 0 ? (
        <div className="p-20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Staff Records Found</h3>
          <p className="text-gray-500 text-lg">Adjust your filters or add new staff members to get started.</p>
        </div>
      ) : (
        <div className="p-4 md:p-8">
          {/* Professional Table Headers - Hidden on Mobile */}
          <div className="hidden md:grid mb-6 grid-cols-12 gap-6 items-center px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="col-span-1 flex justify-center">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={handleMasterCheckbox}
                  className="w-5 h-5 rounded-md border-2 border-gray-300 text-slate-600 focus:ring-slate-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  title={allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
                />
                {someSelected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Employee Profile</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Contact Info</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Work Details</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Documentation</span>
              </div>
            </div>
            <div className="col-span-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Status</span>
              </div>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</span>
            </div>
          </div>

          {/* Mobile Header - Visible only on Mobile */}
          <div className="md:hidden mb-3 flex items-center justify-between p-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected
                }}
                onChange={handleMasterCheckbox}
                className="w-4 h-4 rounded border-2 border-gray-300 text-slate-600"
                title={allSelected ? 'Deselect All' : 'Select All'}
              />
              <span className="text-sm font-semibold text-slate-700">All</span>
            </div>
            {selectedStaff.length > 0 && (
              <div className="bg-emerald-100 rounded-full px-2 py-1">
                <span className="text-emerald-700 text-xs font-semibold">{selectedStaff.length}</span>
              </div>
            )}
          </div>

          {/* Professional Card Rows */}
          <div className="space-y-2 md:space-y-3">
            {filteredStaff.map((person, index) => (
              <div 
                key={person.id} 
                className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden hover:border-slate-300"
              >
                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-6 items-center p-6">
                  {/* Selection Checkbox */}
                  <div className="col-span-1 flex justify-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(person.id)}
                        onChange={() => onToggleSelection(person.id)}
                        className="w-5 h-5 rounded-md border-2 border-gray-300 text-slate-600 focus:ring-slate-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:border-slate-400"
                      />
                    </div>
                  </div>
                  
                  {/* Employee Profile */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-lg border border-slate-200">
                          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                          <span className="text-xs font-bold text-white">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-slate-700 transition-colors">
                          {person.name}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium truncate">{person.department || 'No department'}</p>
                        {person.batchNo && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              Batch {person.batchNo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="col-span-2">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Phone</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {person.phone || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Card ID</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {person.cardNo || 'No card'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Work Assignment */}
                  <div className="col-span-2">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Hotel</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {person.hotel || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documentation */}
                  <div className="col-span-2">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Visa Type</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {person.visaType || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-9 4v10a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Visa Expiry</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'No expiry'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1 flex justify-center">
                    <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg transition-all duration-200 ${
                      person.status === 'Working' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                        : person.status === 'Jobless'
                        ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                        : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                    }`}>
                      <div className="text-xl mb-1">
                        {person.status === 'Working' ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : person.status === 'Jobless' ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-bold leading-none text-center">
                        {person.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-1 flex flex-col space-y-2">
                    <button
                      onClick={() => onViewStaff(person)}
                      className="w-11 h-11 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditStaff(person)}
                      className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Edit Staff"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteStaff(person._id || person.id)}
                      className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Delete Staff"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden p-3">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(person.id)}
                        onChange={() => onToggleSelection(person.id)}
                        className="w-4 h-4 rounded border-2 border-gray-300 text-slate-600"
                      />
                      <div className="w-4 h-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      person.status === 'Working' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : person.status === 'Jobless'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {person.status}
                    </div>
                  </div>

                  {/* Employee Profile */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-slate-900 mb-1 truncate">{person.name}</h3>
                    <p className="text-xs text-slate-600 font-medium truncate">{person.department || 'No department'}</p>
                    {person.batchNo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mt-1">
                        B{person.batchNo}
                      </span>
                    )}
                  </div>

                  {/* Compact Information Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {/* Contact Info */}
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <div className="flex items-center space-x-1 mb-1">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-xs text-slate-500 font-semibold">PHONE</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {person.phone || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <div className="flex items-center space-x-1 mb-1">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-xs text-slate-500 font-semibold">HOTEL</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {person.hotel || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                      <div className="flex items-center space-x-1 mb-1">
                        <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-slate-500 font-semibold">VISA</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {person.visaType || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Compact Bottom Info */}
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span>${person.salary || '0'}</span>
                      </div>
                      {person.passportExpireDate && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{new Date(person.passportExpireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-slate-400 text-xs">#{person.id}</span>
                  </div>

                  {/* Compact Mobile Actions */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onViewStaff(person)}
                      className="flex-1 px-2 py-1.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1 hover:from-slate-600 hover:to-slate-700 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => onEditStaff(person)}
                      className="flex-1 px-2 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1 hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteStaff(person._id || person.id)}
                      className="flex-1 px-2 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1 hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Del</span>
                    </button>
                  </div>
                </div>
                
                {/* Desktop Footer Bar */}
                <div className="hidden md:block px-6 py-4 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">${person.salary || '0'}</span> /month
                        </span>
                      </div>
                      {person.passportExpireDate && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-slate-600">
                            Passport expires: <span className="font-semibold text-slate-900">{new Date(person.passportExpireDate).toLocaleDateString()}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-xs font-mono">#{person.id}</span>
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
