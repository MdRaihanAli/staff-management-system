import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { VacationRequest, VacationStats } from '../types/vacation'

interface VacationContextType {
  vacations: VacationRequest[]
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>
  addVacationRequest: (vacation: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateVacationRequest: (id: number, updates: Partial<VacationRequest>) => void
  deleteVacationRequest: (id: number) => void
  getVacationStats: () => VacationStats
}

const VacationContext = createContext<VacationContextType | undefined>(undefined)

interface VacationProviderProps {
  children: ReactNode
}

export const VacationProvider: React.FC<VacationProviderProps> = ({ children }) => {
  const [vacations, setVacations] = useState<VacationRequest[]>([])

  const addVacationRequest = (vacation: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('VacationContext: addVacationRequest called with:', vacation)
    
    const newVacation: VacationRequest = {
      ...vacation,
      id: Math.max(...vacations.map(v => v.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('VacationContext: Creating new vacation:', newVacation)
    setVacations(prev => {
      const updated = [...prev, newVacation]
      console.log('VacationContext: Updated vacations list:', updated)
      return updated
    })
  }

  const updateVacationRequest = (id: number, updates: Partial<VacationRequest>) => {
    setVacations(prev => 
      prev.map(vacation => 
        vacation.id === id 
          ? { ...vacation, ...updates, updatedAt: new Date().toISOString() }
          : vacation
      )
    )
  }

  const deleteVacationRequest = (id: number) => {
    setVacations(prev => prev.filter(vacation => vacation.id !== id))
  }

  const getVacationStats = (): VacationStats => {
    const totalRequests = vacations.length
    const pendingRequests = vacations.filter(v => v.status === 'Pending').length
    const approvedRequests = vacations.filter(v => v.status === 'Approved').length
    const ongoingVacations = vacations.filter(v => v.status === 'Ongoing').length
    const completedVacations = vacations.filter(v => v.status === 'Completed').length
    const rejectedRequests = vacations.filter(v => v.status === 'Rejected').length
    const totalDaysRequested = vacations.reduce((sum, v) => sum + v.totalDays, 0)
    const totalSalaryHeld = vacations.reduce((sum, v) => sum + v.salaryHold, 0)
    const totalAdvanceGiven = vacations.reduce((sum, v) => sum + v.salaryAdvance, 0)

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      ongoingVacations,
      completedVacations,
      rejectedRequests,
      totalDaysRequested,
      totalSalaryHeld,
      totalAdvanceGiven
    }
  }

  const value: VacationContextType = {
    vacations,
    setVacations,
    addVacationRequest,
    updateVacationRequest,
    deleteVacationRequest,
    getVacationStats
  }

  return (
    <VacationContext.Provider value={value}>
      {children}
    </VacationContext.Provider>
  )
}

export const useVacations = (): VacationContextType => {
  const context = useContext(VacationContext)
  if (!context) {
    throw new Error('useVacations must be used within a VacationProvider')
  }
  return context
}
