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
  hireDate: string
}

interface AllStaffPageProps {
  staff: Staff[]
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
}

const AllStaffPage: React.FC<AllStaffPageProps> = ({ staff, setStaff }) => {
  // Helper function to calculate days until visa expiry
  const calculateDaysUntilExpiry = (expireDate: string) => {
    if (!expireDate) return null
    const today = new Date()
    const expiry = new Date(expireDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter staff to show only those with visa information
  const staffWithVisas = staff.filter(person => 
    person.status !== 'Exited' && person.expireDate
  ).map(person => ({
    ...person,
    daysUntilExpiry: calculateDaysUntilExpiry(person.expireDate)
  })).sort((a, b) => (a.daysUntilExpiry || 0) - (b.daysUntilExpiry || 0))

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center">
            <span className="mr-4">🏨</span>
            Professional Hotel Staff Management
          </h1>
          <p className="text-xl text-blue-100">
            Comprehensive staff management system for hotels and hospitality industry
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold">{staffWithVisas.length}</div>
              <div className="text-sm text-blue-100">Staff with Visas</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-300">
                {staffWithVisas.filter(s => (s.daysUntilExpiry || 0) <= 0).length}
              </div>
              <div className="text-sm text-blue-100">Expired Visas</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300">
                {staffWithVisas.filter(s => (s.daysUntilExpiry || 0) > 0 && (s.daysUntilExpiry || 0) <= 60).length}
              </div>
              <div className="text-sm text-blue-100">Expiring Soon (60 days)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visa Expiry Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">🛂</span>
            Visa Expiry Status
          </h2>
          <p className="text-indigo-100 mt-2">Monitor visa expiration dates and take action before they expire</p>
        </div>

        {staffWithVisas.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Visa Information Found</h3>
            <p className="text-gray-600">No staff members have visa expiry dates recorded.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Staff Info</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Hotel</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Visa Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Issue Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Expire Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Days Remaining</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffWithVisas.map((person) => {
                    const daysRemaining = person.daysUntilExpiry
                    const isExpired = daysRemaining !== null && daysRemaining <= 0
                    const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30
                    const isExpiringWarning = daysRemaining !== null && daysRemaining > 30 && daysRemaining <= 60

                    return (
                      <tr key={person.id} className={`hover:bg-gray-50 transition-colors ${
                        isExpired ? 'bg-red-50' : 
                        isExpiringSoon ? 'bg-orange-50' : 
                        isExpiringWarning ? 'bg-yellow-50' : ''
                      }`}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                            <div className="text-sm text-gray-500">{person.designation || 'No designation'}</div>
                            <div className="text-xs text-gray-400">Batch: {person.batchNo || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{person.hotel || 'Unassigned'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            person.visaType === 'Employment' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {person.visaType || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {person.issueDate ? new Date(person.issueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`text-sm font-bold ${
                              isExpired ? 'text-red-600' :
                              isExpiringSoon ? 'text-orange-600' :
                              isExpiringWarning ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {daysRemaining !== null ? (
                                daysRemaining <= 0 ? 
                                  `Expired ${Math.abs(daysRemaining)} days ago` :
                                  `${daysRemaining} days`
                              ) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            isExpired 
                              ? 'bg-red-100 text-red-800' 
                              : isExpiringSoon 
                              ? 'bg-orange-100 text-orange-800'
                              : isExpiringWarning
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isExpired ? '🚨 EXPIRED' :
                             isExpiringSoon ? '⚠️ URGENT' :
                             isExpiringWarning ? '📅 WARNING' :
                             '✅ VALID'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {staffWithVisas.map((person) => {
                const daysRemaining = person.daysUntilExpiry
                const isExpired = daysRemaining !== null && daysRemaining <= 0
                const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30
                const isExpiringWarning = daysRemaining !== null && daysRemaining > 30 && daysRemaining <= 60

                return (
                  <div key={person.id} className={`rounded-xl p-4 shadow-sm border-2 ${
                    isExpired ? 'bg-red-50 border-red-200' : 
                    isExpiringSoon ? 'bg-orange-50 border-orange-200' : 
                    isExpiringWarning ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{person.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold truncate">{person.designation || 'No designation'}</p>
                        <p className="text-xs text-gray-500 truncate">Batch: {person.batchNo || 'N/A'}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full flex-shrink-0 ml-2 ${
                        isExpired 
                          ? 'bg-red-100 text-red-800' 
                          : isExpiringSoon 
                          ? 'bg-orange-100 text-orange-800'
                          : isExpiringWarning
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isExpired ? '🚨 EXPIRED' :
                         isExpiringSoon ? '⚠️ URGENT' :
                         isExpiringWarning ? '📅 WARNING' :
                         '✅ VALID'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-gray-500 font-medium">Hotel:</span>
                        <p className="font-semibold text-gray-900">{person.hotel || 'Unassigned'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Visa Type:</span>
                        <p className="font-semibold text-gray-900">{person.visaType || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Issue Date:</span>
                        <p className="font-semibold text-gray-900">
                          {person.issueDate ? new Date(person.issueDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Expire Date:</span>
                        <p className="font-semibold text-gray-900">
                          {person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <span className="text-gray-500 font-medium text-sm">Days Remaining:</span>
                        <p className={`text-xl font-bold ${
                          isExpired ? 'text-red-600' :
                          isExpiringSoon ? 'text-orange-600' :
                          isExpiringWarning ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {daysRemaining !== null ? (
                            daysRemaining <= 0 ? 
                              `Expired ${Math.abs(daysRemaining)} days ago` :
                              `${daysRemaining} days`
                          ) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AllStaffPage
