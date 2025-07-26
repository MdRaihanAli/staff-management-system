import React, { useState } from 'react'

interface NavigationProps {
  currentPage: 'home' | 'allstaff'
  setCurrentPage: (page: 'home' | 'allstaff') => void
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg border-b border-blue-700 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-white rounded-lg p-2 shadow-md">
              <img 
                src="/vs4.png" 
                alt="VS4 Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                <span className="text-white">VS4</span> Staff Management
              </h1>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-white">VS4</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-white text-blue-700 shadow-md transform scale-105'
                  : 'text-blue-100 hover:text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setCurrentPage('allstaff')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 'allstaff'
                  ? 'bg-white text-blue-700 shadow-md transform scale-105'
                  : 'text-blue-100 hover:text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              👥 All Staff
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none focus:text-white p-2"
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setCurrentPage('home')
                  setIsMobileMenuOpen(false)
                }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                  currentPage === 'home'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  setCurrentPage('allstaff')
                  setIsMobileMenuOpen(false)
                }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                  currentPage === 'allstaff'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                👥 All Staff
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
