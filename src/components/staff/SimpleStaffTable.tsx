import React from 'react'
import type { Staff } from '../../types/staff'

interface SimpleStaffTableProps {
  staff: Staff[]
}

const SimpleStaffTable: React.FC<SimpleStaffTableProps> = ({ staff }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-xl font-bold text-white">Staff Directory</h2>
        <p className="text-blue-100">Simple table view with essential information</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {person.batchNo || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{person.name}</div>
                  <div className="text-sm text-gray-500">#{person.sl}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.department || 'No department'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.hotel || 'Unassigned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {staff.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No staff data available
          </div>
        )}
        
        {staff.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{staff.length}</span> staff members
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleStaffTable
