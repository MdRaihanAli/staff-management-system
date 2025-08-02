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
    salaryMin: string
    salaryMax: string
    passportExpireDate: string
    cardNumber: string
    status: string
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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">🔍</span>
          Search & Filter
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAdvancedSearch(!advancedSearch)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            {advancedSearch ? '📋 Basic Search' : '🔧 Advanced Search'}
          </button>
          <button
            onClick={onPrint}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Basic Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search name, batch, card number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <select
          value={filterHotel}
          onChange={(e) => setFilterHotel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">🏨 All Hotels</option>
          {hotels.map(hotel => (
            <option key={hotel} value={hotel}>{hotel}</option>
          ))}
        </select>
        <select
          value={filterVisa}
          onChange={(e) => setFilterVisa(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">📄 All Visa Types</option>
          <option value="Employment">Employment</option>
          <option value="Visit">Visit</option>
        </select>
        <input
          type="date"
          placeholder="📅 Expire Date"
          value={filterExpireDate}
          onChange={(e) => setFilterExpireDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Advanced Search */}
      {advancedSearch && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-bold text-blue-900 mb-3">🔧 Advanced Search Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              placeholder="🛂 Passport Expire Date"
              value={searchFilters.passportExpireDate}
              onChange={(e) => setSearchFilters({...searchFilters, passportExpireDate: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="text"
              placeholder="💳 Card Number"
              value={searchFilters.cardNumber}
              onChange={(e) => setSearchFilters({...searchFilters, cardNumber: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <select
              value={searchFilters.status}
              onChange={(e) => setSearchFilters({...searchFilters, status: e.target.value})}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">👔 All Status</option>
              <option value="Working">Working</option>
              <option value="Jobless">Jobless</option>
              <option value="Exited">Exited</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters
