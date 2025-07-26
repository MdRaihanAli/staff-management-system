import { useState } from 'react'
import type { Staff, NewStaff } from '../types/staff'
import { useStaff } from '../contexts/StaffContext'
import { generateSampleData } from '../utils/staffUtils'

export const useStaffOperations = () => {
  const { staff, setStaff, hotels, departments } = useStaff()
  const [batchError, setBatchError] = useState('')

  const addStaff = (newStaff: NewStaff) => {
    // Check for duplicate batch number (case-insensitive)
    const duplicateBatch = staff.find(s => 
      s.batchNo.toLowerCase() === newStaff.batchNo.toLowerCase() && 
      newStaff.batchNo !== ''
    )
    if (duplicateBatch) {
      setBatchError('Batch number already  exists. Please use a unique batch number.')
      return false
    }
    setBatchError('')

    // Only require name and designation - other fields are optional
    if (newStaff.name.trim()) {
      const newId = Math.max(...staff.map(s => s.id), 0) + 1
      const newSl = Math.max(...staff.map(s => s.sl), 0) + 1
      const staffToAdd: Staff = { 
        ...newStaff, 
        id: newId,
        sl: newSl,
        name: newStaff.name.trim(),
        designation: newStaff.designation.trim() || 'Not Specified'
      }
      setStaff([...staff, staffToAdd])
      return true
    }
    return false
  }

  const editStaff = (updatedStaff: Staff) => {
    // Check for duplicate batch number (excluding the current staff member, case-insensitive)
    const duplicateBatch = staff.find(s => 
      s.batchNo.toLowerCase() === updatedStaff.batchNo.toLowerCase() && 
      updatedStaff.batchNo !== '' && 
      s.id !== updatedStaff.id
    )
    if (duplicateBatch) {
      setBatchError('Batch number already exists. Please use a unique batch number.')
      return false
    }
    setBatchError('')
    
    setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s))
    return true
  }

  const deleteStaff = (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== id))
      return true
    }
    return false
  }

  const addSampleData = () => {
    if (confirm('This will add sample staff data. Continue?')) {
      const sampleStaff = generateSampleData(staff, hotels)
      setStaff([...staff, ...sampleStaff])
      alert(`Added ${sampleStaff.length} sample staff members!`)
    }
  }

  const bulkDelete = (selectedIds: number[]) => {
    if (confirm(`Delete ${selectedIds.length} selected staff members?`)) {
      setStaff(staff.filter(s => !selectedIds.includes(s.id)))
      alert(`Deleted ${selectedIds.length} staff members.`)
      return true
    }
    return false
  }

  const bulkUpdateHotel = (selectedIds: number[], newHotel: string) => {
    if (newHotel) {
      setStaff(staff.map(s => 
        selectedIds.includes(s.id) ? { ...s, hotel: newHotel } : s
      ))
      alert(`Updated hotel for ${selectedIds.length} staff members.`)
      return true
    }
    return false
  }

  const bulkUpdateStatus = (selectedIds: number[], newStatus: 'Working' | 'Jobless' | 'Exited') => {
    if (newStatus) {
      setStaff(staff.map(s => 
        selectedIds.includes(s.id) ? { ...s, status: newStatus } : s
      ))
      alert(`Updated status for ${selectedIds.length} staff members.`)
      return true
    }
    return false
  }

  return {
    staff,
    setStaff,
    hotels,
    departments,
    batchError,
    setBatchError,
    addStaff,
    editStaff,
    deleteStaff,
    addSampleData,
    bulkDelete,
    bulkUpdateHotel,
    bulkUpdateStatus
  }
}
