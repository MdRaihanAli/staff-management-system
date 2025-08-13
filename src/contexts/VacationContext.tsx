import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { VacationRequest, VacationStats } from '../types/vacation'
import StaffAPI from '../services/api'

interface VacationContextType {
  vacations: VacationRequest[]
  loading: boolean
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>
  addVacationRequest: (vacation: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateVacationRequest: (id: number, updates: Partial<VacationRequest>) => Promise<void>
  deleteVacationRequest: (id: number) => Promise<void>
  getVacationStats: () => VacationStats
  loadVacations: () => Promise<void>
}

const VacationContext = createContext<VacationContextType | undefined>(undefined)

interface VacationProviderProps {
  children: ReactNode
}

export const VacationProvider: React.FC<VacationProviderProps> = ({ children }) => {
  const [vacations, setVacations] = useState<VacationRequest[]>([])
  const [loading, setLoading] = useState(false)

  // Load vacations from MongoDB on component mount
  useEffect(() => {
    loadVacations()
  }, [])

  const loadVacations = async () => {
    try {
      setLoading(true)
      console.log('📋 Loading vacations from MongoDB...')
      const vacationData = await StaffAPI.getAllVacations()
      setVacations(vacationData)
      console.log(`✅ Loaded ${vacationData.length} vacation requests from MongoDB`)
    } catch (error) {
      console.error('❌ Error loading vacations:', error)
      // Keep empty array on error
      setVacations([])
    } finally {
      setLoading(false)
    }
  }

  const addVacationRequest = async (vacation: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('VacationContext: Creating vacation request in MongoDB...', vacation)
      const newVacation = await StaffAPI.createVacation(vacation)
      console.log('✅ Vacation request created in MongoDB:', newVacation)
      
      // Add to local state
      setVacations(prev => [...prev, newVacation])
    } catch (error) {
      console.error('❌ Error creating vacation request:', error)
      throw error
    }
  }

  const updateVacationRequest = async (id: number, updates: Partial<VacationRequest>) => {
    try {
      console.log(`🔄 Updating vacation request ${id} in MongoDB...`, updates)
      const updatedVacation = await StaffAPI.updateVacation(id.toString(), updates)
      console.log('✅ Vacation request updated in MongoDB:', updatedVacation)
      
      // Update local state
      setVacations(prev => 
        prev.map(vacation => 
          vacation.id === id 
            ? { ...vacation, ...updatedVacation }
            : vacation
        )
      )
    } catch (error) {
      console.error('❌ Error updating vacation request:', error)
      throw error
    }
  }

  const deleteVacationRequest = async (id: number) => {
    try {
      console.log(`🗑️ Deleting vacation request ${id} from MongoDB...`)
      await StaffAPI.deleteVacation(id.toString())
      console.log('✅ Vacation request deleted from MongoDB')
      
      // Remove from local state
      setVacations(prev => prev.filter(vacation => vacation.id !== id))
    } catch (error) {
      console.error('❌ Error deleting vacation request:', error)
      throw error
    }
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
    loading,
    setVacations,
    addVacationRequest,
    updateVacationRequest,
    deleteVacationRequest,
    getVacationStats,
    loadVacations
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
