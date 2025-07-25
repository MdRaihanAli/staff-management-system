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

interface StaffFormProps {
  staff: Staff
  onUpdate: (field: string, value: string) => void
  onSave: () => void
  onCancel: () => void
  hotels: string[]
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
        {batchError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {batchError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="📋 Batch No (Optional)"
            value={staff.batchNo}
            onChange={(e) => onUpdate('batchNo', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="👤 Name *"
            value={staff.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            required
          />
          <input
            type="text"
            placeholder="💼 Designation"
            value={staff.designation}
            onChange={(e) => onUpdate('designation', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <select
            value={staff.visaType}
            onChange={(e) => onUpdate('visaType', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">🛂 Visa Type</option>
            <option value="Employment">Employment</option>
            <option value="Visit">Visit</option>
          </select>
          <input
            type="text"
            placeholder="🆔 Card No"
            value={staff.cardNo}
            onChange={(e) => onUpdate('cardNo', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <input
            type="date"
            placeholder="📅 Issue Date"
            value={staff.issueDate}
            onChange={(e) => onUpdate('issueDate', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <input
            type="date"
            placeholder="📅 Expire Date"
            value={staff.expireDate}
            onChange={(e) => onUpdate('expireDate', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <input
            type="tel"
            placeholder="📞 Phone"
            value={staff.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <select
            value={staff.status}
            onChange={(e) => onUpdate('status', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="Working">✅ Working</option>
            <option value="Jobless">❌ Jobless</option>
            <option value="Exited">🚪 Exited</option>
          </select>
          <select
            value={staff.hotel}
            onChange={(e) => onUpdate('hotel', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">🏨 Select Hotel</option>
            {hotels.map(hotel => (
              <option key={hotel} value={hotel}>{hotel}</option>
            ))}
          </select>
          <input
            type="url"
            placeholder="📷 Photo URL"
            value={staff.photo}
            onChange={(e) => onUpdate('photo', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="📝 Remark"
            value={staff.remark}
            onChange={(e) => onUpdate('remark', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
          >
            ✅ {isEdit ? 'Save Changes' : 'Add Staff'}
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
