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
        
        // Load all data concurrently
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
        
        console.log('✅ Data loaded successfully from external server')
        setIsLoaded(true)
      } catch (error) {
        console.error('❌ Error loading data from API:', error)
        // Fallback to default values if API fails
        setHotels(['Grand Plaza Hotel', 'Ocean View Resort', 'City Center Inn', 'Mountain Lodge', 'Beach Paradise Hotel'])
        setCompanies(['Hotel Management Corp', 'Resort Services Ltd', 'Hospitality Group Inc', 'Tourism Solutions', 'Guest Services Co', 'Accommodation Partners', 'Travel & Stay Inc'])
        setDepartments(['Front Desk Manager', 'Receptionist', 'Housekeeping Supervisor', 'Housekeeper', 'Chef', 'Waiter', 'Security Guard', 'Maintenance Worker', 'Lifeguard', 'Manager', 'Assistant Manager', 'Supervisor', 'Staff'])
        setIsLoaded(true)
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
      setStaff(prev => [...prev, newStaff])
      console.log('✅ Staff member added to MongoDB')
      return newStaff
    } catch (error) {
      console.error('❌ Error adding staff to MongoDB:', error)
      throw error
    }
  }

  // Function to update staff member in MongoDB
  const updateStaffInAPI = async (id: string, staffData: any) => {
    try {
      const updatedStaff = await StaffAPI.updateStaff(id, staffData)
      setStaff(prev => prev.map(s => s._id === id ? updatedStaff : s))
      console.log('✅ Staff member updated in MongoDB')
      return updatedStaff
    } catch (error) {
      console.error('❌ Error updating staff in MongoDB:', error)
      throw error
    }
  }

  // Function to delete staff member from MongoDB
  const deleteStaffFromAPI = async (id: string) => {
    try {
      await StaffAPI.deleteStaff(id)
      setStaff(prev => prev.filter(s => s._id !== id))
      console.log('✅ Staff member deleted from MongoDB')
    } catch (error) {
      console.error('❌ Error deleting staff from MongoDB:', error)
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
    deleteStaffFromAPI
  }

  // Don't render children until data is loaded
  if (!isLoaded) {
    return <div>Loading staff data...</div>
  }

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  )
}
