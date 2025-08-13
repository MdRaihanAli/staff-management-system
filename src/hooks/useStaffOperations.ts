import { useState } from 'react'
import type { Staff, NewStaff } from '../types/staff'
import { useStaff } from '../contexts/StaffContext'
import { useNotification } from '../contexts/NotificationContext'
import { useConfirmDialog } from '../components/ConfirmDialog'
import { generateSampleData } from '../utils/staffUtils'

export const useStaffOperations = () => {
  const { staff, setStaff, hotels, addStaffToAPI, updateStaffInAPI, deleteStaffFromAPI } = useStaff()
  const { showSuccess, showError } = useNotification()
  const { showConfirm } = useConfirmDialog()
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
        showSuccess(
          '✅ Staff Added Successfully!',
          `${newStaff.name.trim()} has been added to the staff list.`
        )
        return true
      } catch (error) {
        console.error('Error adding staff:', error)
        showError(
          '❌ Failed to Add Staff',
          'There was an error adding the staff member. Please try again.'
        )
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
      console.log('🔄 Attempting to update staff with ID:', staffId)
      console.log('📋 Staff data being sent:', updatedStaff)
      await updateStaffInAPI(staffId, updatedStaff)
      showSuccess(
        '✅ Staff Updated Successfully!',
        `${updatedStaff.name}'s information has been updated.`
      )
      return true
    } catch (error) {
      console.error('❌ Error updating staff:', error)
      console.error('📊 Staff object that failed:', updatedStaff)
      showError(
        '❌ Failed to Update Staff',
        'There was an error updating the staff member. Please try again.'
      )
      return false
    }
  }

  const deleteStaff = async (id: number | string) => {
    console.log('🗑️ Delete function called with ID:', id)
    
    // Find the staff member to get their name
    const staffMember = staff.find(s => s.id === id || s._id === id)
    console.log('📋 Staff member found:', staffMember)
    
    if (!staffMember) {
      console.log('❌ No staff member found with ID:', id)
      showError('❌ Staff Not Found', 'Could not find the staff member to delete.')
      return false
    }

    console.log('🔔 Showing confirmation dialog for:', staffMember.name)
    
    try {
      const confirmed = await showConfirm(
        '🗑️ Delete Staff Member',
        `Are you sure you want to delete ${staffMember.name}? This action cannot be undone.`,
        {
          confirmText: 'Delete',
          cancelText: 'Cancel',
          type: 'danger'
        }
      )

      console.log('✅ Confirmation result:', confirmed)
      
      if (confirmed) {
        try {
          const staffId = staffMember._id || staffMember.id?.toString()
          if (!staffId) {
            throw new Error('Staff ID not found')
          }
          
          console.log('🌐 Calling deleteStaffFromAPI with ID:', staffId)
          await deleteStaffFromAPI(staffId)
          console.log('✅ Delete API call successful')
          
          showSuccess(
            '✅ Staff Deleted Successfully!',
            `${staffMember.name} has been removed from the staff list.`
          )
          return true
        } catch (error) {
          console.error('❌ Error deleting staff:', error)
          showError(
            '❌ Failed to Delete Staff',
            'There was an error deleting the staff member. Please try again.'
          )
          return false
        }
      } else {
        console.log('🚫 User cancelled deletion')
        return false
      }
    } catch (error) {
      console.error('❌ Error in confirmation dialog:', error)
      showError(
        '❌ Dialog Error',
        'There was an error with the confirmation dialog.'
      )
      return false
    }
  }

  const addSampleData = async () => {
    const confirmed = await showConfirm(
      '📊 Add Sample Data',
      'This will add sample staff data to your list. Continue?',
      {
        confirmText: 'Add Sample Data',
        cancelText: 'Cancel',
        type: 'info'
      }
    )

    if (confirmed) {
      try {
        const sampleStaff = generateSampleData(staff, hotels)
        setStaff([...staff, ...sampleStaff])
        showSuccess(
          '✅ Sample Data Added!',
          `Added ${sampleStaff.length} sample staff members to your list.`
        )
      } catch (error) {
        console.error('Error adding sample data:', error)
        showError(
          '❌ Failed to Add Sample Data',
          'There was an error adding sample data. Please try again.'
        )
      }
    }
  }

  const bulkDelete = async (selectedIds: number[]) => {
    const confirmed = await showConfirm(
      '🗑️ Bulk Delete Staff',
      `Are you sure you want to delete ${selectedIds.length} selected staff members? This action cannot be undone.`,
      {
        confirmText: 'Delete All',
        cancelText: 'Cancel',
        type: 'danger'
      }
    )

    if (confirmed) {
      try {
        setStaff(staff.filter(s => !selectedIds.includes(s.id)))
        showSuccess(
          '✅ Bulk Delete Successful!',
          `Deleted ${selectedIds.length} staff members from the list.`
        )
        return true
      } catch (error) {
        console.error('Error deleting staff:', error)
        showError(
          '❌ Failed to Delete Staff',
          'There was an error deleting the selected staff members.'
        )
        return false
      }
    }
    return false
  }

  const bulkUpdateHotel = (selectedIds: number[], newHotel: string) => {
    if (newHotel) {
      try {
        setStaff(staff.map(s => 
          selectedIds.includes(s.id) ? { ...s, hotel: newHotel } : s
        ))
        showSuccess(
          '✅ Hotel Updated Successfully!',
          `Updated hotel for ${selectedIds.length} staff members to "${newHotel}".`
        )
        return true
      } catch (error) {
        console.error('Error updating hotel:', error)
        showError(
          '❌ Failed to Update Hotel',
          'There was an error updating the hotel information.'
        )
        return false
      }
    }
    return false
  }

  const bulkUpdateStatus = (selectedIds: number[], newStatus: 'Working' | 'Jobless' | 'Exited') => {
    if (newStatus) {
      try {
        setStaff(staff.map(s => 
          selectedIds.includes(s.id) ? { ...s, status: newStatus } : s
        ))
        showSuccess(
          '✅ Status Updated Successfully!',
          `Updated status for ${selectedIds.length} staff members to "${newStatus}".`
        )
        return true
      } catch (error) {
        console.error('Error updating status:', error)
        showError(
          '❌ Failed to Update Status',
          'There was an error updating the status information.'
        )
        return false
      }
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
