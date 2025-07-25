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

interface HomePageProps {
  staff: Staff[]
}

const HomePage: React.FC<HomePageProps> = ({ staff }) => {
  // Get unique hotels and count staff for each
  const hotelStats = staff.reduce((acc, person) => {
    if (!acc[person.hotel]) {
      acc[person.hotel] = {
        total: 0,
        working: 0,
        departments: new Set<string>(),
        departmentCounts: {} as Record<string, number>
      }
    }
    acc[person.hotel].total++
    if (person.status === 'Working') {
      acc[person.hotel].working++
    }
    acc[person.hotel].departments.add(person.department)
    // Count staff by department
    if (!acc[person.hotel].departmentCounts[person.department]) {
      acc[person.hotel].departmentCounts[person.department] = 0
    }
    acc[person.hotel].departmentCounts[person.department]++
    return acc
  }, {} as Record<string, { 
    total: number; 
    working: number; 
    departments: Set<string>;
    departmentCounts: Record<string, number>
  }>)

  const totalStaff = staff.length
  const totalWorkingStaff = staff.filter(s => s.status === 'Working').length
  const totalJoblessStaff = staff.filter(s => s.status === 'Jobless').length
  const totalExitedStaff = staff.filter(s => s.status === 'Exited').length
  const totalHotels = Object.keys(hotelStats).length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Total Hotels</h3>
              <p className="text-2xl sm:text-3xl font-bold">{totalHotels}</p>
            </div>
            <div className="text-2xl sm:text-3xl opacity-75">🏨</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Total Staff</h3>
              <p className="text-2xl sm:text-3xl font-bold">{totalStaff}</p>
            </div>
            <div className="text-2xl sm:text-3xl opacity-75">👥</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Working Staff</h3>
              <p className="text-2xl sm:text-3xl font-bold">{totalWorkingStaff}</p>
            </div>
            <div className="text-2xl sm:text-3xl opacity-75">✅</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Jobless Staff</h3>
              <p className="text-2xl sm:text-3xl font-bold">{totalJoblessStaff}</p>
            </div>
            <div className="text-2xl sm:text-3xl opacity-75">❌</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Exited Staff</h3>
              <p className="text-2xl sm:text-3xl font-bold">{totalExitedStaff}</p>
            </div>
            <div className="text-2xl sm:text-3xl opacity-75">🚪</div>
          </div>
        </div>
      </div>

      {/* Hotel Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <span className="mr-2">🏨</span>
          Staff by Hotel
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {Object.entries(hotelStats).map(([hotel, stats]) => (
            <div key={hotel} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 truncate" title={hotel}>
                {hotel}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Total Staff:</span>
                  <span className="font-semibold text-lg sm:text-xl bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                    {stats.total}
                  </span>
                </div>
                
                {/* Department-wise staff count */}
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-gray-700 text-sm font-medium block mb-3">📊 Staff by Department:</span>
                  <div className="space-y-2">
                    {Object.entries(stats.departmentCounts).map(([dept, count]) => {
                      const deptEmojis: Record<string, string> = {
                        'Front Desk': '🏨',
                        'Housekeeping': '🧹',
                        'Restaurant': '🍽️',
                        'Kitchen': '👨‍🍳',
                        'Maintenance': '🔧',
                        'Management': '👔'
                      }
                      return (
                        <div key={dept} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
                          <span className="text-xs sm:text-sm text-gray-600 flex items-center truncate">
                            <span className="mr-2 text-sm">{deptEmojis[dept] || '📋'}</span>
                            <span className="truncate">{dept}</span>
                          </span>
                          <span className="font-semibold text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded flex-shrink-0 ml-2">
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <span className="mr-2">📊</span>
          Department Distribution
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {['Front Desk', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'Management'].map(dept => {
            const deptCount = staff.filter(s => s.department === dept).length
            const deptEmojis = {
              'Front Desk': '🏨',
              'Housekeeping': '🧹',
              'Restaurant': '🍽️',
              'Kitchen': '👨‍🍳',
              'Maintenance': '🔧',
              'Management': '👔'
            }
            return (
              <div key={dept} className="text-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-gradient-to-b from-white to-gray-50 hover:from-blue-50 hover:to-blue-100">
                <div className="text-lg sm:text-xl mb-1">{deptEmojis[dept as keyof typeof deptEmojis]}</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">{deptCount}</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{dept}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomePage
