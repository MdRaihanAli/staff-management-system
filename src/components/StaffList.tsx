import React from 'react'

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
  passportExpireDate: string
}

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
        <div className="space-y-4">
          {filteredStaff.map((person) => (
            <div key={person.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(person.id)}
                    onChange={() => onToggleSelection(person.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{person.name}</h3>
                    <p className="text-sm text-blue-600 font-semibold truncate">{person.designation || 'No designation'}</p>
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
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
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
                  {person.expireDate ? (
                    <p className={`font-semibold ${
                      new Date(person.expireDate) < new Date() 
                        ? 'text-red-600' 
                        : new Date(person.expireDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? 'text-orange-600'
                        : 'text-gray-900'
                    }`}>
                      {new Date(person.expireDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-900">N/A</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onViewStaff(person)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => onEditStaff(person)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
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
      )}
    </div>
  )
}

export default StaffList
