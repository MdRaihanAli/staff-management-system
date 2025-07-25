import React from 'react'
import type { Staff } from '../../types/staff'

interface StaffHeaderProps {
  staff: Staff[]
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ 
  staff
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1">
      
          
          {/* Visa Expiry Alerts - Within 2 Months */}
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
           
            {(() => {
              const currentDate = new Date()
              const twoMonthsFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
              
              const expiringStaff = staff.filter(person => {
                if (person.status === 'Exited' || !person.expireDate) return false
                const expireDate = new Date(person.expireDate)
                return expireDate >= currentDate && expireDate <= twoMonthsFromNow
              })
              
              const expiredStaff = staff.filter(person => {
                if (person.status === 'Exited' || !person.expireDate) return false
                const expireDate = new Date(person.expireDate)
                return expireDate < currentDate
              })

              if (expiredStaff.length === 0 && expiringStaff.length === 0) {
                return (
                  <div className="flex items-center justify-center p-3 bg-green-100 rounded-lg">
                    <span className="text-green-700 font-medium flex items-center">
                      <span className="mr-2">🟢</span>
                      All visas are valid for the next 2 months
                    </span>
                  </div>
                )
              }

              return (
                <div className="space-y-3">
                  {expiredStaff.length > 0 && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-red-800 font-semibold flex items-center">
                          <span className="mr-2">🔴</span>
                          Expired Visas: {expiredStaff.length} staff
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-red-700">
                        {expiredStaff.slice(0, 3).map(person => (
                          <div key={person.id} className="flex justify-between">
                            <span>{person.name}</span>
                            <span>{person.expireDate ? new Date(person.expireDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        ))}
                        {expiredStaff.length > 3 && (
                          <div className="text-red-600 font-medium">+ {expiredStaff.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {expiringStaff.length > 0 && (
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-800 font-semibold flex items-center">
                          <span className="mr-2">🟡</span>
                          Expiring Soon: {expiringStaff.length} staff
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-yellow-700">
                        {expiringStaff.slice(0, 3).map(person => {
                          const expireDate = new Date(person.expireDate)
                          const daysLeft = Math.ceil((expireDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
                          return (
                            <div key={person.id} className="flex justify-between">
                              <span>{person.name}</span>
                              <span className="font-medium">{daysLeft} days left</span>
                            </div>
                          )
                        })}
                        {expiringStaff.length > 3 && (
                          <div className="text-yellow-600 font-medium">+ {expiringStaff.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffHeader
