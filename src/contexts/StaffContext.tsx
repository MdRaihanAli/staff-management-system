import React, { createContext, useContext, useState } from 'react'
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

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [hotels, setHotels] = useState<string[]>([
    'Grand Plaza Hotel', 
    'Ocean View Resort', 
    'City Center Inn', 
    'Mountain Lodge', 
    'Beach Paradise Hotel'
  ])
  const [departments, setDepartments] = useState<string[]>([
    'Manager', 
    'Assistant Manager', 
    'Supervisor', 
    'Staff', 
    'Receptionist', 
    'Housekeeper', 
    'Chef', 
    'Waiter', 
    'Security Guard', 
    'Maintenance Worker'
  ])

  const value: StaffContextType = {
    staff,
    setStaff,
    hotels,
    setHotels,
    departments,
    setDepartments
  }

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  )
}
