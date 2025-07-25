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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <span className="mr-2">👥</span>
        Active Staff ({filteredStaff.length})
      </h2>
      
      {filteredStaff.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No staff members found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">Select</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">📋 SL</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">🔢 Batch</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">👤 Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">💼 Designation</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">🏨 Hotel</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">📞 Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">🛂 Visa</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">📊 Status</th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(person.id)}
                        onChange={() => onToggleSelection(person.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{person.sl}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{person.batchNo || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{person.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{person.designation || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{person.hotel || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{person.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{person.visaType || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        person.status === 'Working' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {person.status === 'Working' ? '✅' : '❌'} {person.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewStaff(person)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => onEditStaff(person)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteStaff(person.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
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

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredStaff.map((person) => (
              <div key={person.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(person.id)}
                      onChange={() => onToggleSelection(person.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 truncate">{person.name}</h3>
                      <p className="text-sm text-gray-600 font-semibold truncate">{person.designation || 'No designation'}</p>
                      {person.batchNo && (
                        <p className="text-xs text-gray-500 truncate">Batch: {person.batchNo}</p>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full flex-shrink-0 ml-2 ${
                    person.status === 'Working' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {person.status === 'Working' ? '✅' : '❌'} {person.status}
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
                    <span className="text-gray-500 font-medium">SL:</span>
                    <p className="font-semibold text-gray-900">{person.sl}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onViewStaff(person)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => onEditStaff(person)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDeleteStaff(person.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default StaffList
