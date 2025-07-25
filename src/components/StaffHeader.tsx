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

interface StaffHeaderProps {
  staff: Staff[]
  onAddStaff: () => void
  onManage: () => void
  onViewExited: () => void
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ 
  staff, 
  onAddStaff, 
  onManage, 
  onViewExited 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="mr-3 text-3xl lg:text-4xl">🏨</span>
            Professional Hotel Staff Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Comprehensive staff management system for hotels and hospitality industry
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              📊 Total: {staff.length}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Working: {staff.filter(s => s.status === 'Working').length}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ❌ Jobless: {staff.filter(s => s.status === 'Jobless').length}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              🚪 Exited: {staff.filter(s => s.status === 'Exited').length}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={onAddStaff}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            ➕ Add Staff
          </button>
          <button
            onClick={onManage}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            ⚙️ Manage
          </button>
          <button
            onClick={onViewExited}
            className="w-full sm:w-auto bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            🚪 View Exited Staff ({staff.filter(s => s.status === 'Exited').length})
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffHeader
