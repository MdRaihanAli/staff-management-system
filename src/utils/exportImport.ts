import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import type { Staff } from '../types/staff'
import StaffAPI from '../services/api'

// Export to Excel
export const exportToExcel = (staff: Staff[]) => {
  const ws = XLSX.utils.json_to_sheet(staff.map(s => ({
    'SL': s.sl,
    'Batch No': s.batchNo,
    'Name': s.name,
    'Department': s.department,
    'Company': s.company,
    'Visa Type': s.visaType,
    'Card No': s.cardNo,
    'Issue Date': s.issueDate,
    'Expire Date': s.expireDate,
    'Phone': s.phone,
    'Status': s.status,
    'Hotel': s.hotel,
    'Salary': s.salary,
    'Passport Expire Date': s.passportExpireDate,
    'Photo': s.photo,
    'Remark': s.remark
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Staff')
  XLSX.writeFile(wb, `staff_data_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Export to Word
export const exportToWord = async (staff: Staff[]) => {
  const tableRows = staff.map(s => new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(s.sl.toString())] }),
      new TableCell({ children: [new Paragraph(s.batchNo || '')] }),
      new TableCell({ children: [new Paragraph(s.name)] }),
      new TableCell({ children: [new Paragraph(s.department || '')] }),
      new TableCell({ children: [new Paragraph(s.company || '')] }),
      new TableCell({ children: [new Paragraph(s.visaType || '')] }),
      new TableCell({ children: [new Paragraph(s.cardNo || '')] }),
      new TableCell({ children: [new Paragraph(s.issueDate || '')] }),
      new TableCell({ children: [new Paragraph(s.expireDate || '')] }),
      new TableCell({ children: [new Paragraph(s.phone || '')] }),
      new TableCell({ children: [new Paragraph(s.status)] }),
      new TableCell({ children: [new Paragraph(s.hotel || '')] }),
      new TableCell({ children: [new Paragraph(s.remark || '')] })
    ]
  }))

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: 'Staff Management Report',
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({
          text: `Generated on: ${new Date().toLocaleDateString()}`
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph('SL')] }),
                new TableCell({ children: [new Paragraph('Batch')] }),
                new TableCell({ children: [new Paragraph('Name')] }),
                new TableCell({ children: [new Paragraph('Department')] }),
                new TableCell({ children: [new Paragraph('Company')] }),
                new TableCell({ children: [new Paragraph('Visa Type')] }),
                new TableCell({ children: [new Paragraph('Card No')] }),
                new TableCell({ children: [new Paragraph('Issue Date')] }),
                new TableCell({ children: [new Paragraph('Expire Date')] }),
                new TableCell({ children: [new Paragraph('Phone')] }),
                new TableCell({ children: [new Paragraph('Status')] }),
                new TableCell({ children: [new Paragraph('Hotel')] }),
                new TableCell({ children: [new Paragraph('Remark')] })
              ]
            }),
            ...tableRows
          ]
        })
      ]
    }]
  })

  const buffer = await Packer.toBuffer(doc)
  saveAs(new Blob([buffer]), `staff_report_${new Date().toISOString().split('T')[0]}.docx`)
}

// Export to JSON
export const exportToJSON = (staff: Staff[]) => {
  const dataStr = JSON.stringify(staff, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  saveAs(dataBlob, `staff_data_${new Date().toISOString().split('T')[0]}.json`)
}

// Import from JSON
export const importFromJSON = async (
  event: React.ChangeEvent<HTMLInputElement>,
  currentStaff: Staff[],
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (Array.isArray(data)) {
          // Check for batch number duplicates before importing
          const existingBatchNumbers = currentStaff
            .filter(s => s.batchNo && s.batchNo.trim() !== '')
            .map(s => s.batchNo.toLowerCase())
          
          const duplicateBatches: string[] = []
          const validStaff: any[] = []
          
          data.forEach((item) => {
            const batchNo = (item.batchNo || '').trim()
            if (batchNo !== '') {
              const lowerBatch = batchNo.toLowerCase()
              if (existingBatchNumbers.includes(lowerBatch) || 
                  validStaff.some(s => s.batchNo.toLowerCase() === lowerBatch)) {
                duplicateBatches.push(batchNo)
              } else {
                validStaff.push(item)
              }
            } else {
              validStaff.push(item) // Allow empty batch numbers
            }
          })
          
          if (duplicateBatches.length > 0) {
            const duplicateList = duplicateBatches.join(', ')
            if (validStaff.length > 0) {
              const proceed = confirm(
                `Warning: ${duplicateBatches.length} staff members have duplicate batch numbers and will be skipped:\n${duplicateList}\n\nDo you want to import the remaining ${validStaff.length} valid staff members?`
              )
              if (!proceed) return
            } else {
              alert(`Import failed: All ${duplicateBatches.length} staff members have duplicate batch numbers:\n${duplicateList}`)
              return
            }
          }
          
          if (validStaff.length > 0) {
            try {
              console.log('🚀 Starting JSON import process...')
              console.log('📊 Valid staff to import:', validStaff.length)
              
              // Prepare staff data for MongoDB import
              const newStaff = validStaff.map((item) => ({
                batchNo: item.batchNo || '',
                name: item.name || '',
                department: item.department || '',
                company: item.company || '',
                visaType: item.visaType || '',
                cardNo: item.cardNo || '',
                issueDate: item.issueDate || '',
                expireDate: item.expireDate || '',
                phone: item.phone || '',
                status: item.status || 'Working',
                photo: item.photo || '',
                remark: item.remark || '',
                hotel: item.hotel || '',
                salary: item.salary || 0,
                passportExpireDate: item.passportExpireDate || ''
              }))
              
              console.log('📤 Prepared staff data:', newStaff)
              
              // Save to MongoDB via API
              console.log('🔄 Calling StaffAPI.bulkImport...')
              const importResult = await StaffAPI.bulkImport(newStaff)
              console.log('✅ Import API response:', importResult)
              
              // Refresh the staff list from MongoDB
              console.log('🔄 Refreshing staff list from MongoDB...')
              const refreshedStaff = await StaffAPI.getAllStaff()
              console.log('📋 Refreshed staff count:', refreshedStaff?.length || 0)
              setStaff(refreshedStaff || [])
              
              alert(`✅ Successfully imported ${newStaff.length} staff members to MongoDB!${duplicateBatches.length > 0 ? ` (${duplicateBatches.length} duplicates skipped)` : ''}`)
            } catch (error) {
              console.error('❌ Error importing to MongoDB:', error)
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              alert(`❌ Error saving imported data to database: ${errorMessage}. Please try again.`)
            }
          }
        }
      } catch (error) {
        alert('Error importing JSON file. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }
}

// Import from Excel
export const importFromExcel = async (
  event: React.ChangeEvent<HTMLInputElement>,
  currentStaff: Staff[],
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        // Check for batch number duplicates before importing
        const existingBatchNumbers = currentStaff
          .filter(s => s.batchNo && s.batchNo.trim() !== '')
          .map(s => s.batchNo.toLowerCase())
        
        const duplicateBatches: string[] = []
        const validStaff: any[] = []
        
        jsonData.forEach((item: any) => {
          const batchNo = (item['Batch No'] || item.batchNo || '').toString().trim()
          if (batchNo !== '') {
            const lowerBatch = batchNo.toLowerCase()
            if (existingBatchNumbers.includes(lowerBatch) || 
                validStaff.some(s => s.extractedBatchNo.toLowerCase() === lowerBatch)) {
              duplicateBatches.push(batchNo)
            } else {
              validStaff.push({...item, extractedBatchNo: batchNo})
            }
          } else {
            validStaff.push({...item, extractedBatchNo: batchNo}) // Allow empty batch numbers
          }
        })
        
        if (duplicateBatches.length > 0) {
          const duplicateList = duplicateBatches.join(', ')
          if (validStaff.length > 0) {
            const proceed = confirm(
              `Warning: ${duplicateBatches.length} staff members have duplicate batch numbers and will be skipped:\n${duplicateList}\n\nDo you want to import the remaining ${validStaff.length} valid staff members?`
            )
            if (!proceed) return
          } else {
            alert(`Import failed: All ${duplicateBatches.length} staff members have duplicate batch numbers:\n${duplicateList}`)
            return
          }
        }
        
        if (validStaff.length > 0) {
          try {
            console.log('🚀 Starting Excel import process...')
            console.log('📊 Valid staff to import:', validStaff.length)
            
            // Prepare staff data for MongoDB import
            const newStaff = validStaff.map((item: any) => ({
              batchNo: item.extractedBatchNo,
              name: item['Name'] || item.name || '',
              department: item['Department'] || item.department || '',
              company: item['Company'] || item.company || '',
              visaType: item['Visa Type'] || item.visaType || '',
              cardNo: item['Card No'] || item.cardNo || '',
              issueDate: item['Issue Date'] || item.issueDate || '',
              expireDate: item['Expire Date'] || item.expireDate || '',
              phone: item['Phone'] || item.phone || '',
              status: item['Status'] || item.status || 'Working',
              photo: item['Photo'] || item.photo || '',
              remark: item['Remark'] || item.remark || '',
              hotel: item['Hotel'] || item.hotel || '',
              salary: item['Salary'] || item.salary || 0,
              passportExpireDate: item['Passport Expire Date'] || item.passportExpireDate || ''
            }))
            
            console.log('📤 Prepared staff data:', newStaff)
            
            // Save to MongoDB via API
            console.log('🔄 Calling StaffAPI.bulkImport...')
            const importResult = await StaffAPI.bulkImport(newStaff)
            console.log('✅ Import API response:', importResult)
            
            // Refresh the staff list from MongoDB
            console.log('🔄 Refreshing staff list from MongoDB...')
            const refreshedStaff = await StaffAPI.getAllStaff()
            console.log('📋 Refreshed staff count:', refreshedStaff?.length || 0)
            setStaff(refreshedStaff || [])
            
            alert(`✅ Successfully imported ${newStaff.length} staff members to MongoDB from Excel!${duplicateBatches.length > 0 ? ` (${duplicateBatches.length} duplicates skipped)` : ''}`)
          } catch (error) {
            console.error('❌ Error importing to MongoDB:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            alert(`❌ Error saving imported data to database: ${errorMessage}. Please try again.`)
          }
        }
      } catch (error) {
        alert('Error importing Excel file. Please check the file format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }
}
