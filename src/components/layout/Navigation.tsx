import React, { useState } from 'react'

interface NavigationProps {
  currentPage: 'home' | 'allstaff'
  setCurrentPage: (page: 'home' | 'allstaff') => void
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl border-b border-blue-700 mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-white rounded-xl p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <img 
                src="/vs4.png" 
                alt="VS4 Logo" 
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                <span className="text-blue-100 drop-shadow-lg">VS4</span>{' '}
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Staff Management
                </span>
              </h1>
              <p className="text-blue-100 text-sm opacity-90">Professional Hotel Staff System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-xl font-bold text-white drop-shadow-lg">VS4</h1>
            </div>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-lg ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-white to-blue-50 text-blue-700 shadow-xl transform scale-105 border-2 border-white/20'
                  : 'text-blue-100 hover:text-white hover:bg-white/20 hover:shadow-lg hover:scale-102 backdrop-blur-sm'
              }`}
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('allstaff')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-lg ${
                currentPage === 'allstaff'
                  ? 'bg-gradient-to-r from-white to-blue-50 text-blue-700 shadow-xl transform scale-105 border-2 border-white/20'
                  : 'text-blue-100 hover:text-white hover:bg-white/20 hover:shadow-lg hover:scale-102 backdrop-blur-sm'
              }`}
            >
              👥 Staff Management
            </button>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-100 p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 relative z-20">
            <div className="flex flex-col space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl">
              <button
                onClick={() => {
                  setCurrentPage('home')
                  setIsMobileMenuOpen(false)
                }}
                className={`px-6 py-4 rounded-xl font-semibold text-left transition-all duration-300 ${
                  currentPage === 'home'
                    ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                    : 'text-blue-100 hover:text-white hover:bg-white/20 hover:shadow-md'
                }`}
              >
                🏠 Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentPage('allstaff')
                  setIsMobileMenuOpen(false)
                }}
                className={`px-6 py-4 rounded-xl font-semibold text-left transition-all duration-300 ${
                  currentPage === 'allstaff'
                    ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                    : 'text-blue-100 hover:text-white hover:bg-white/20 hover:shadow-md'
                }`}
              >
                👥 Staff Management
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
