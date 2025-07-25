import React from 'react'

interface DataManagementProps {
  onExportExcel: () => void
  onExportWord: () => void
  onExportJSON: () => void
  onImportExcel: (event: React.ChangeEvent<HTMLInputElement>) => void
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void
  onGenerateSample: () => void
  onAddStaff: () => void
  onManage: () => void
  onViewExited: () => void
}

const DataManagement: React.FC<DataManagementProps> = ({
  onExportExcel,
  onExportWord,
  onExportJSON,
  onImportExcel,
  onImportJSON,
  onGenerateSample,
  onAddStaff,
  onManage,
  onViewExited
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Data Management
      </h2>
      
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button
          onClick={onAddStaff}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ➕ Add Staff
        </button>
        <button
          onClick={onManage}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ⚙️ Manage
        </button>
        <button
          onClick={onViewExited}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🚪 View Exited Staff
        </button>
      </div>

      {/* Data Import/Export Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">💾</span>
          Import & Export
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Export Options */}
        <button
          onClick={onExportExcel}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
        >
          📊 Excel
        </button>
        <button
          onClick={onExportWord}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
        >
          📄 Word
        </button>
        <button
          onClick={onExportJSON}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
        >
          💾 JSON
        </button>
        
        {/* Import Options */}
        <label className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium text-sm flex items-center justify-center cursor-pointer">
          📥 Import Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={onImportExcel}
            className="hidden"
          />
        </label>
        <label className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-medium text-sm flex items-center justify-center cursor-pointer">
          📂 Import JSON
          <input
            type="file"
            accept=".json"
            onChange={onImportJSON}
            className="hidden"
          />
        </label>

        {/* Data Actions */}
        <button
          onClick={onGenerateSample}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium text-sm flex items-center justify-center"
        >
          🎲 Sample Data
        </button>
        </div>
      </div>
    </div>
  )
}

export default DataManagement
