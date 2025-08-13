import { useState } from 'react'
import type { Staff, NewStaff } from '../types/staff'
import { useStaff } from '../contexts/StaffContext'
import { generateSampleData } from '../utils/staffUtils'

export const useStaffOperations = () => {
  const { staff, setStaff, hotels, addStaffToAPI, updateStaffInAPI, deleteStaffFromAPI } = useStaff()
  const [batchError, setBatchError] = useState('')

  const addStaff = async (newStaff: NewStaff) => {
    // Check for duplicate batch number (case-insensitive)
    const duplicateBatch = staff.find(s => 
      s.batchNo.toLowerCase() === newStaff.batchNo.toLowerCase() && 
      newStaff.batchNo !== ''
    )
    if (duplicateBatch) {
      setBatchError('Batch number already exists. Please use a unique batch number.')
      return false
    }
    setBatchError('')

    // Only require name - other fields are optional and can be empty
    if (newStaff.name.trim()) {
      try {
        const newSl = staff.length > 0 ? Math.max(...staff.map(s => s.sl || 0), 0) + 1 : 1
        const staffToAdd = { 
          ...newStaff, 
          sl: newSl,
          name: newStaff.name.trim()
          // Keep all other fields exactly as entered
        }
        await addStaffToAPI(staffToAdd)
        return true
      } catch (error) {
        console.error('Error adding staff:', error)
        alert('Failed to add staff member. Please try again.')
        return false
      }
    }
    return false
  }

  const editStaff = async (updatedStaff: Staff) => {
    // Check for duplicate batch number (excluding the current staff member, case-insensitive)
    const duplicateBatch = staff.find(s => 
      s.batchNo.toLowerCase() === updatedStaff.batchNo.toLowerCase() && 
      updatedStaff.batchNo !== '' && 
      (s.id !== updatedStaff.id || s._id !== updatedStaff._id)
    )
    if (duplicateBatch) {
      setBatchError('Batch number already exists. Please use a unique batch number.')
      return false
    }
    setBatchError('')
    
    try {
      // Use MongoDB _id for API calls, fallback to id for local data
      const staffId = updatedStaff._id || updatedStaff.id?.toString()
      if (!staffId) {
        throw new Error('Staff ID not found')
      }
      await updateStaffInAPI(staffId, updatedStaff)
      return true
    } catch (error) {
      console.error('Error updating staff:', error)
      alert('Failed to update staff member. Please try again.')
      return false
    }
  }

  const deleteStaff = async (id: number | string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Find the staff member to get the MongoDB _id
        const staffMember = staff.find(s => s.id === id || s._id === id)
        if (!staffMember) {
          throw new Error('Staff member not found')
        }
        
        const staffId = staffMember._id || staffMember.id?.toString()
        if (!staffId) {
          throw new Error('Staff ID not found')
        }
        
        await deleteStaffFromAPI(staffId)
        return true
      } catch (error) {
        console.error('Error deleting staff:', error)
        alert('Failed to delete staff member. Please try again.')
        return false
      }
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
