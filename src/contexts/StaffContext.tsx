import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Staff, StaffContextType } from '../types/staff'
import StaffAPI from '../services/api'

const StaffContext = createContext<StaffContextType | undefined>(undefined)

export const useStaff = () => {
  const context = useContext(StaffContext)
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider')
  }
  return context
}

interface StaffProviderProps {
  children: ReactNode
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [hotels, setHotels] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load data from MongoDB API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading data from external server API...')
        console.log('🌐 API Base URL:', 'http://localhost:3000/api')
        
        // Test basic connectivity first
        console.log('🧪 Testing basic connectivity...')
        const testResponse = await fetch('http://localhost:3000/api/test')
        console.log('✅ Test response status:', testResponse.status)
        
        // Load all data concurrently
        console.log('📡 Loading data concurrently...')
        const [staffData, hotelsData, companiesData, departmentsData] = await Promise.all([
          StaffAPI.getAllStaff(),
          StaffAPI.getHotels(),
          StaffAPI.getCompanies(),
          StaffAPI.getDepartments()
        ])
        
        console.log('📊 Raw data received:')
        console.log('- Staff:', staffData?.length || 0, 'records')
        console.log('- Hotels:', hotelsData?.length || 0, 'items')
        console.log('- Companies:', companiesData?.length || 0, 'items')
        console.log('- Departments:', departmentsData?.length || 0, 'items')
        
        // Server already provides normalized data, no need to re-normalize
        setStaff(staffData || [])
        setHotels(hotelsData || [])
        setCompanies(companiesData || [])
        setDepartments(departmentsData || [])
        
        console.log('✅ Data loaded successfully from external server')
        setIsLoaded(true)
        console.log('🎉 App is now loaded and ready!')
      } catch (error) {
        console.error('❌ Error loading data from API:', error)
        console.error('🔍 Error details:', error instanceof Error ? error.message : 'Unknown error')
        console.error('🌐 Network error? Check if server is running on localhost:3000')
        
        // Fallback to default values if API fails
        setHotels(['Grand Plaza Hotel', 'Ocean View Resort', 'City Center Inn', 'Mountain Lodge', 'Beach Paradise Hotel'])
        setCompanies(['Hotel Management Corp', 'Resort Services Ltd', 'Hospitality Group Inc', 'Tourism Solutions', 'Guest Services Co', 'Accommodation Partners', 'Travel & Stay Inc'])
        setDepartments(['Front Desk Manager', 'Receptionist', 'Housekeeping Supervisor', 'Housekeeper', 'Chef', 'Waiter', 'Security Guard', 'Maintenance Worker', 'Lifeguard', 'Manager', 'Assistant Manager', 'Supervisor', 'Staff'])
        setStaff([]) // Empty staff array for offline mode
        setIsLoaded(true)
        console.log('🔧 Fallback mode activated - app should load now')
        alert('⚠️ Could not connect to external server. Using offline mode. Please ensure your server is running on localhost:3000')
      }
    }
    loadData()
  }, [])

  // Track changes and show notification when data is modified
  const setStaffWithChangeTracking = (newStaff: Staff[] | ((prev: Staff[]) => Staff[])) => {
    setStaff(newStaff)
    // No need for change tracking with API - changes are immediately saved to MongoDB
    console.log('✅ Staff data updated in MongoDB')
  }

  // Function to add new staff member to MongoDB
  const addStaffToAPI = async (staffData: any) => {
    try {
      const newStaff = await StaffAPI.createStaff(staffData)
      console.log('✅ Staff member added to MongoDB')
      
      // Reload all staff data to ensure consistency
      const refreshedStaffData = await StaffAPI.getAllStaff()
      console.log('🔄 Refreshing staff list, found:', refreshedStaffData?.length || 0, 'staff members')
      setStaff(refreshedStaffData || [])
      
      return newStaff
    } catch (error) {
      console.error('❌ Error adding staff to MongoDB:', error)
      throw error
    }
  }

  // Function to update staff member in MongoDB
  const updateStaffInAPI = async (id: string, staffData: any) => {
    try {
      console.log('🌐 API Call: Updating staff with ID:', id)
      console.log('📤 Data being sent to API:', staffData)
      const updatedStaff = await StaffAPI.updateStaff(id, staffData)
      console.log('✅ Staff member updated in MongoDB')
      console.log('📥 Response from API:', updatedStaff)
      
      // Reload all staff data to ensure consistency
      const refreshedStaffData = await StaffAPI.getAllStaff()
      console.log('🔄 Refreshing staff list after update, found:', refreshedStaffData?.length || 0, 'staff members')
      setStaff(refreshedStaffData || [])
      
      return updatedStaff
    } catch (error) {
      console.error('❌ Error updating staff in MongoDB:', error)
      console.error('🆔 Failed ID:', id)
      console.error('📋 Failed data:', staffData)
      throw error
    }
  }

  // Function to delete staff member from MongoDB
  const deleteStaffFromAPI = async (id: string) => {
    try {
      console.log('🌐 API Call: Deleting staff with ID:', id)
      await StaffAPI.deleteStaff(id)
      console.log('✅ Staff member deleted from MongoDB')
      
      // Reload all staff data to ensure consistency
      const refreshedStaffData = await StaffAPI.getAllStaff()
      console.log('🔄 Refreshing staff list after delete, found:', refreshedStaffData?.length || 0, 'staff members')
      setStaff(refreshedStaffData || [])
    } catch (error) {
      console.error('❌ Error deleting staff from MongoDB:', error)
      console.error('🆔 Failed delete ID:', id)
      throw error
    }
  }

  // Bulk operations
  const bulkDeleteFromAPI = async (ids: string[]) => {
    try {
      await StaffAPI.bulkDelete(ids)
      console.log('✅ Bulk delete completed in MongoDB')
      
      // Reload all staff data to ensure consistency
      const refreshedStaffData = await StaffAPI.getAllStaff()
      console.log('🔄 Refreshing staff list after bulk delete, found:', refreshedStaffData?.length || 0, 'staff members')
      setStaff(refreshedStaffData || [])
    } catch (error) {
      console.error('❌ Error in bulk delete:', error)
      throw error
    }
  }

  const bulkUpdateHotelInAPI = async (ids: string[], hotel: string) => {
    try {
      await StaffAPI.bulkUpdateHotel(ids, hotel)
      console.log('✅ Bulk hotel update completed in MongoDB')
      
      // Reload all staff data to ensure consistency
      const refreshedStaffData = await StaffAPI.getAllStaff()
      console.log('🔄 Refreshing staff list after bulk hotel update, found:', refreshedStaffData?.length || 0, 'staff members')
      setStaff(refreshedStaffData || [])
    } catch (error) {
      console.error('❌ Error in bulk hotel update:', error)
      throw error
    }
  }

  const bulkUpdateStatusInAPI = async (ids: string[], status: string) => {
    try {
      await StaffAPI.bulkUpdateStatus(ids, status)
      console.log('✅ Bulk status update completed in MongoDB')
      
      // Reload all staff data to ensure consistency
      const refreshedStaffData = await StaffAPI.getAllStaff()
      console.log('🔄 Refreshing staff list after bulk status update, found:', refreshedStaffData?.length || 0, 'staff members')
      setStaff(refreshedStaffData || [])
    } catch (error) {
      console.error('❌ Error in bulk status update:', error)
      throw error
    }
  }

  // Hotel management functions
  const addHotelToAPI = async (name: string) => {
    try {
      await StaffAPI.addHotel(name)
      setHotels(prev => [...prev, name])
      console.log('✅ Hotel added to MongoDB')
    } catch (error) {
      console.error('❌ Error adding hotel:', error)
      throw error
    }
  }

  const deleteHotelFromAPI = async (name: string) => {
    try {
      await StaffAPI.deleteHotel(name)
      setHotels(prev => prev.filter(h => h !== name))
      console.log('✅ Hotel deleted from MongoDB')
    } catch (error) {
      console.error('❌ Error deleting hotel:', error)
      throw error
    }
  }

  // Company management functions
  const addCompanyToAPI = async (name: string) => {
    try {
      await StaffAPI.addCompany(name)
      setCompanies(prev => [...prev, name])
      console.log('✅ Company added to MongoDB')
    } catch (error) {
      console.error('❌ Error adding company:', error)
      throw error
    }
  }

  const deleteCompanyFromAPI = async (name: string) => {
    try {
      await StaffAPI.deleteCompany(name)
      setCompanies(prev => prev.filter(c => c !== name))
      console.log('✅ Company deleted from MongoDB')
    } catch (error) {
      console.error('❌ Error deleting company:', error)
      throw error
    }
  }

  // Department management functions
  const addDepartmentToAPI = async (name: string) => {
    try {
      await StaffAPI.addDepartment(name)
      setDepartments(prev => [...prev, name])
      console.log('✅ Department added to MongoDB')
    } catch (error) {
      console.error('❌ Error adding department:', error)
      throw error
    }
  }

  const deleteDepartmentFromAPI = async (name: string) => {
    try {
      await StaffAPI.deleteDepartment(name)
      setDepartments(prev => prev.filter(d => d !== name))
      console.log('✅ Department deleted from MongoDB')
    } catch (error) {
      console.error('❌ Error deleting department:', error)
      throw error
    }
  }

  // Function to save current data to JSON file (for backup/export)
  const saveToJsonFile = () => {
    // Create complete data structure with all information
    const completeData = {
      staff: staff,
      hotels: hotels,
      companies: companies,
      departments: departments,
      lastUpdated: new Date().toISOString()
    }
    
    const jsonString = JSON.stringify(completeData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'staff_data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Show enhanced instruction with workflow
    alert(`📁 staff_data.json downloaded successfully! 

📋 NEXT STEPS:
1. ✅ File downloaded to your Downloads folder
2. 📂 Copy the downloaded 'staff_data.json' file  
3. 📁 Replace 'public/staff_data.json' with the copied file
4. 🔄 Click 'Reload Data' button to sync changes

⚠️  Until you complete these steps, your changes exist only in memory!`)
    
    console.log('💾 Data saved to download. Complete the workflow to sync with public/staff_data.json')
  }

  // Load data from JSON file (staff_data.json) - refresh from API
  const loadFromJsonFile = async (): Promise<boolean> => {
    try {
      console.log('🔄 Refreshing data from MongoDB API...')
      const [staffData, hotelsData, companiesData, departmentsData] = await Promise.all([
        StaffAPI.getAllStaff(),
        StaffAPI.getHotels(),
        StaffAPI.getCompanies(),
        StaffAPI.getDepartments()
      ])
      
      setStaff(staffData)
      setHotels(hotelsData)
      setCompanies(companiesData)
      setDepartments(departmentsData)
      
      // Clear unsaved changes flag after successful reload
      setHasUnsavedChanges(false)
      console.log('✅ Data refreshed from MongoDB API!')
      
      return true
    } catch (error) {
      console.error('❌ Error refreshing data from API:', error)
      return false
    }
  }

  // Load real data from JSON file (fallback function)
  const loadRealData = async (): Promise<boolean> => {
    try {
      const response = await fetch('/staff_data_100.json')
      if (!response.ok) {
        throw new Error('Failed to fetch staff data')
      }
      const realStaffData: Staff[] = await response.json()
      setStaff(realStaffData)
      return true
    } catch (error) {
      console.error('Error loading real data:', error)
      alert('Failed to load real data. Please make sure the staff_data_100.json file is available.')
      return false
    }
  }

  const value: StaffContextType = {
    staff,
    setStaff: setStaffWithChangeTracking,
    hotels,
    setHotels,
    companies,
    setCompanies,
    departments,
    setDepartments,
    loadRealData,
    saveToJsonFile,
    loadFromJsonFile,
    hasUnsavedChanges,
    addStaffToAPI,
    updateStaffInAPI,
    deleteStaffFromAPI,
    bulkDeleteFromAPI,
    bulkUpdateHotelInAPI,
    bulkUpdateStatusInAPI,
    addHotelToAPI,
    deleteHotelFromAPI,
    addCompanyToAPI,
    deleteCompanyFromAPI,
    addDepartmentToAPI,
    deleteDepartmentFromAPI
  }

  // Don't render children until data is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading staff data...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to MongoDB server on localhost:3000</p>
        </div>
      </div>
    )
  }

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  )
}
