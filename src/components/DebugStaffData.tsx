import React, { useState, useEffect } from 'react'
import { useStaff } from '../contexts/StaffContext'

const DebugStaffData: React.FC = () => {
  const { staff } = useStaff()
  const [apiTest, setApiTest] = useState<string>('Testing...')
  const [apiStaffCount, setApiStaffCount] = useState<number>(0)

  useEffect(() => {
    // Test API connection
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test')
        if (response.ok) {
          setApiTest('✅ API Connected')
          
          // Get staff count from API
          const staffResponse = await fetch('http://localhost:3000/api/staff')
          if (staffResponse.ok) {
            const staffData = await staffResponse.json()
            setApiStaffCount(staffData.data?.length || 0)
          }
        } else {
          setApiTest('❌ API Connection Failed')
        }
      } catch (error) {
        setApiTest('❌ API Error: ' + (error as Error).message)
      }
    }
    testAPI()
  }, [])

  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug: Staff Data State</h3>
      <div className="text-sm text-yellow-700">
        <p><strong>API Connection:</strong> {apiTest}</p>
        <p><strong>API Staff Count:</strong> {apiStaffCount}</p>
        <p><strong>Frontend Staff Count:</strong> {staff.length}</p>
        <p><strong>Staff Array Type:</strong> {Array.isArray(staff) ? 'Array' : typeof staff}</p>
        <p><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
        {staff.length > 0 && (
          <div>
            <p><strong>Sample Staff Names:</strong></p>
            <ul className="list-disc list-inside">
              {staff.slice(0, 3).map((person, index) => (
                <li key={index}>{person.name} (ID: {person.id || person._id})</li>
              ))}
            </ul>
          </div>
        )}
        {staff.length === 0 && (
          <p className="text-red-600"><strong>⚠️ Frontend staff array is empty!</strong></p>
        )}
        {apiStaffCount !== staff.length && (
          <p className="text-red-600"><strong>🚨 MISMATCH: API has {apiStaffCount} staff but frontend has {staff.length}</strong></p>
        )}
      </div>
    </div>
  )
}

export default DebugStaffData
