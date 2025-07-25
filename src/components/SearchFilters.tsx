import React from 'react'

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterHotel: string
  setFilterHotel: (hotel: string) => void
  filterVisa: string
  setFilterVisa: (visa: string) => void
  filterExpireDate: string
  setFilterExpireDate: (date: string) => void
  hotels: string[]
  advancedSearch: boolean
  setAdvancedSearch: (advanced: boolean) => void
  searchFilters: {
    department: string
    salaryMin: string
    salaryMax: string
    passportExpireDate: string
    cardNumber: string
  }
  setSearchFilters: (filters: any) => void
  onPrint: () => void
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterHotel,
  setFilterHotel,
  filterVisa,
  setFilterVisa,
  filterExpireDate,
  setFilterExpireDate,
  hotels,
  advancedSearch,
  setAdvancedSearch,
  searchFilters,
  setSearchFilters,
  onPrint
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <span className="mr-2">🔍</span>
          Search & Filters
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setAdvancedSearch(!advancedSearch)}
            className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
              advancedSearch 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {advancedSearch ? '📊 Advanced' : '🔧 Basic'}
          </button>
          <button
            onClick={onPrint}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors"
          >
            🖨️ Print
          </button>
        </div>
      </div>
      
      {/* Basic Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
        <select
          value={filterHotel}
          onChange={(e) => setFilterHotel(e.target.value)}
          className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">🏨 All Hotels</option>
          {hotels.map(hotel => (
            <option key={hotel} value={hotel}>{hotel}</option>
          ))}
        </select>
        <select
          value={filterVisa}
          onChange={(e) => setFilterVisa(e.target.value)}
          className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">🛂 All Visa Types</option>
          <option value="Employment">Employment</option>
          <option value="Visit">Visit</option>
        </select>
        <select
          value={filterExpireDate}
          onChange={(e) => setFilterExpireDate(e.target.value)}
          className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">⏰ All Expire Dates</option>
          <option value="expired">🔴 Expired</option>
          <option value="expiring">🟡 Expiring Soon (30 days)</option>
          <option value="valid">🟢 Valid (30+ days)</option>
        </select>
      </div>

      {/* Advanced Search */}
      {advancedSearch && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-bold text-blue-900 mb-3">🔧 Advanced Search Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="💼 Department"
              value={searchFilters.department}
              onChange={(e) => setSearchFilters({...searchFilters, department: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              placeholder="💰 Min Salary"
              value={searchFilters.salaryMin}
              onChange={(e) => setSearchFilters({...searchFilters, salaryMin: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              placeholder="💰 Max Salary"
              value={searchFilters.salaryMax}
              onChange={(e) => setSearchFilters({...searchFilters, salaryMax: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="date"
              placeholder="📅 Passport Expire Date"
              value={searchFilters.passportExpireDate}
              onChange={(e) => setSearchFilters({...searchFilters, passportExpireDate: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="text"
              placeholder="🆔 Card Number"
              value={searchFilters.cardNumber}
              onChange={(e) => setSearchFilters({...searchFilters, cardNumber: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => setSearchFilters({
                department: '',
                salaryMin: '',
                salaryMax: '',
                passportExpireDate: '',
                cardNumber: ''
              })}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              🧹 Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters
