import React from 'react'
import type { Staff } from '../../types/staff'
import { getStaffStats } from '../../utils/staffUtils'

interface HomePageProps {
  staff: Staff[]
}

const HomePage: React.FC<HomePageProps> = ({ staff }) => {
  const stats = getStaffStats(staff)
  
  // Get unique hotels and count staff for each
  const hotelStats = staff.reduce((acc, person) => {
    if (!person.hotel) return acc
    
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
    if (person.department) {
      acc[person.hotel].departments.add(person.department)
      if (!acc[person.hotel].departmentCounts[person.department]) {
        acc[person.hotel].departmentCounts[person.department] = 0
      }
      acc[person.hotel].departmentCounts[person.department]++
    }
    return acc
  }, {} as Record<string, { 
    total: number; 
    working: number; 
    departments: Set<string>; 
    departmentCounts: Record<string, number> 
  }>)

  // Get visa expiry alerts
  const getExpiryAlerts = () => {
    const currentDate = new Date()
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    const expired = staff.filter(s => s.expireDate && new Date(s.expireDate) < currentDate)
    const expiringSoon = staff.filter(s => s.expireDate && new Date(s.expireDate) >= currentDate && new Date(s.expireDate) <= thirtyDaysFromNow)
    
    return { expired, expiringSoon }
  }

  // Get passport expiry alerts
  const getPassportExpiryAlerts = () => {
    const currentDate = new Date()
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    const passportExpired = staff.filter(s => s.passportExpireDate && new Date(s.passportExpireDate) < currentDate)
    const passportExpiringSoon = staff.filter(s => s.passportExpireDate && new Date(s.passportExpireDate) >= currentDate && new Date(s.passportExpireDate) <= thirtyDaysFromNow)
    
    return { passportExpired, passportExpiringSoon }
  }

  const { expired, expiringSoon } = getExpiryAlerts()
  const { passportExpired, passportExpiringSoon } = getPassportExpiryAlerts()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-8 border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Staff</p>
              <p className="text-4xl font-bold text-blue-900 mt-2">{stats.totalStaff}</p>
              <p className="text-sm text-blue-600 mt-1">Active Members</p>
            </div>
            <div className="text-5xl text-blue-600 opacity-80">👥</div>
          </div>
          <div className="mt-4 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl p-8 border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Working Staff</p>
              <p className="text-4xl font-bold text-green-900 mt-2">{stats.workingStaff}</p>
              <p className="text-sm text-green-600 mt-1">Currently Active</p>
            </div>
            <div className="text-5xl text-green-600 opacity-80">✅</div>
          </div>
          <div className="mt-4 bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: stats.totalStaff > 0 ? `${(stats.workingStaff / stats.totalStaff) * 100}%` : '0%'}}></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl shadow-xl p-8 border border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Jobless Staff</p>
              <p className="text-4xl font-bold text-red-900 mt-2">{stats.joblessStaff}</p>
              <p className="text-sm text-red-600 mt-1">Need Assignment</p>
            </div>
            <div className="text-5xl text-red-600 opacity-80">❌</div>
          </div>
          <div className="mt-4 bg-red-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{width: stats.totalStaff > 0 ? `${(stats.joblessStaff / stats.totalStaff) * 100}%` : '0%'}}></div>
          </div>
        </div>
      </div>

      {/* Visa Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl p-8 border border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">🛂</span>
            Visa Status Overview
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-indigo-100">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-lg font-medium text-gray-700">Employment Visa</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.employmentVisa}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-indigo-100">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-lg font-medium text-gray-700">Visit Visa</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats.visitVisa}</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="text-center">
              <p className="text-sm font-medium opacity-90">Total Visa Holders</p>
              <p className="text-3xl font-bold">{stats.employmentVisa + stats.visitVisa}</p>
            </div>
          </div>
        </div>

        {/* Expiry Alerts */}
        <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-xl p-8 border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">⚠️</span>
            Document Expiry Alerts
          </h2>
          <div className="space-y-4">
            {/* Visa Expiry Alerts */}
            {expired.length > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 border border-red-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-3 text-lg">🔴 Expired Visas</span>
                  </div>
                  <span className="text-2xl font-bold text-white bg-red-700 px-3 py-1 rounded-full">{expired.length}</span>
                </div>
                <p className="text-red-100 text-sm mt-2">Immediate attention required</p>
              </div>
            )}
            {expiringSoon.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 border border-yellow-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-3 text-lg">🟡 Visas Expiring Soon</span>
                  </div>
                  <span className="text-2xl font-bold text-white bg-orange-600 px-3 py-1 rounded-full">{expiringSoon.length}</span>
                </div>
                <p className="text-yellow-100 text-sm mt-2">Action needed within 30 days</p>
              </div>
            )}
            
            {/* Passport Expiry Alerts */}
            {passportExpired.length > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 border border-purple-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-3 text-lg">📕 Expired Passports</span>
                  </div>
                  <span className="text-2xl font-bold text-white bg-purple-700 px-3 py-1 rounded-full">{passportExpired.length}</span>
                </div>
                <p className="text-purple-100 text-sm mt-2">Immediate attention required</p>
              </div>
            )}
            {passportExpiringSoon.length > 0 && (
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 border border-blue-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-3 text-lg">📘 Passports Expiring Soon</span>
                  </div>
                  <span className="text-2xl font-bold text-white bg-indigo-600 px-3 py-1 rounded-full">{passportExpiringSoon.length}</span>
                </div>
                <p className="text-blue-100 text-sm mt-2">Action needed within 30 days</p>
              </div>
            )}
            
            {expired.length === 0 && expiringSoon.length === 0 && passportExpired.length === 0 && passportExpiringSoon.length === 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 border border-green-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-center">
                  <span className="text-white font-bold mr-3 text-lg">🟢 All Clear</span>
                </div>
                <p className="text-green-100 text-sm mt-2 text-center">No immediate expiry concerns</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hotel-wise Staff Distribution */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <span className="mr-3 text-3xl">🏨</span>
          Hotel-wise Staff Distribution
        </h2>
        {Object.keys(hotelStats).length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-8xl mb-6">🏨</div>
            <p className="text-white text-lg font-medium">No staff assigned to hotels yet.</p>
            <p className="text-blue-100 mt-2">Staff will appear here once hotels are assigned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(hotelStats).map(([hotel, stats]) => {
              const colorClasses = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600', 
                'from-purple-500 to-purple-600',
                'from-red-500 to-red-600',
                'from-yellow-500 to-yellow-600',
                'from-indigo-500 to-indigo-600',
                'from-pink-500 to-pink-600',
                'from-teal-500 to-teal-600'
              ];
              const colorClass = colorClasses[hotel.length % colorClasses.length];
              
              return (
                <div key={hotel} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center truncate" title={hotel}>
                      <span className="mr-2 text-2xl">�</span>
                      {hotel}
                    </h3>
                    <div className={`text-white text-xl font-bold bg-gradient-to-r ${colorClass} px-3 py-1 rounded-full shadow-lg`}>
                      {stats.total}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-100">Total Staff:</span>
                      <span className="font-medium text-white">{stats.total}</span>
                    </div>
                    
                    {Object.keys(stats.departmentCounts).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/20">
                        <p className="text-xs font-medium text-blue-100 mb-2">All Departments:</p>
                        <div className="space-y-1">
                          {Object.entries(stats.departmentCounts)
                            .sort(([,a], [,b]) => b - a)
                            .map(([dept, count]) => (
                              <div key={dept} className="flex justify-between text-xs">
                                <span className="text-blue-100 truncate">{dept || 'Unassigned'}</span>
                                <span className="font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">{count}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-gradient-to-br from-slate-800 via-gray-900 to-black rounded-2xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <span className="mr-3 text-3xl">📊</span>
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-white mb-2">{Object.keys(hotelStats).length}</div>
            <div className="text-blue-100 font-medium">Active Hotels</div>
            <div className="mt-3 bg-blue-500/30 rounded-full h-1 w-full">
              <div className="bg-blue-300 h-1 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-white mb-2">
              {new Set(staff.filter(s => s.department).map(s => s.department)).size}
            </div>
            <div className="text-green-100 font-medium">Departments</div>
            <div className="mt-3 bg-green-500/30 rounded-full h-1 w-full">
              <div className="bg-green-300 h-1 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-white mb-2">
              {staff.filter(s => s.status === 'Working').length > 0 
                ? Math.round((staff.filter(s => s.status === 'Working').length / stats.totalStaff) * 100)
                : 0}%
            </div>
            <div className="text-purple-100 font-medium">Employment Rate</div>
            <div className="mt-3 bg-purple-500/30 rounded-full h-1 w-full">
              <div 
                className="bg-purple-300 h-1 rounded-full transition-all duration-500" 
                style={{
                  width: `${staff.filter(s => s.status === 'Working').length > 0 
                    ? Math.round((staff.filter(s => s.status === 'Working').length / stats.totalStaff) * 100)
                    : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
