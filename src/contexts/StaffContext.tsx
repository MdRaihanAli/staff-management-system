import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Staff, StaffContextType } from '../types/staff'

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

// Load data from localStorage
const loadStaffFromStorage = (): Staff[] => {
  try {
    const savedStaff = localStorage.getItem('staffData')
    if (savedStaff) {
      return JSON.parse(savedStaff)
    }
  } catch (error) {
    console.error('Error loading staff data from localStorage:', error)
  }
  return []
}

// Save data to localStorage
const saveStaffToStorage = (staff: Staff[]) => {
  try {
    localStorage.setItem('staffData', JSON.stringify(staff))
  } catch (error) {
    console.error('Error saving staff data to localStorage:', error)
  }
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>(loadStaffFromStorage)
  const [hotels, setHotels] = useState<string[]>([
    'Grand Plaza Hotel', 
    'Ocean View Resort', 
    'City Center Inn', 
    'Mountain Lodge', 
    'Beach Paradise Hotel'
  ])
  
  const [departments, setDepartments] = useState<string[]>([
    'Front Desk Manager',
    'Receptionist',
    'Housekeeping Supervisor',
    'Housekeeper',
    'Chef',
    'Waiter',
    'Security Guard',
    'Maintenance Worker',
    'Lifeguard',
    'Manager',
    'Assistant Manager',
    'Supervisor',
    'Staff'
  ])

  // Save to localStorage whenever staff data changes
  useEffect(() => {
    saveStaffToStorage(staff)
  }, [staff])

  // Load real data from JSON file
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
    setStaff,
    hotels,
    setHotels,
    departments,
    setDepartments,
    loadRealData
  }

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  )
}
