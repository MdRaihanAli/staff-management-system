import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import type { Staff } from '../types/staff'

// Export to Excel
export const exportToExcel = (staff: Staff[]) => {
  const ws = XLSX.utils.json_to_sheet(staff.map(s => ({
    'SL': s.sl,
    'Batch No': s.batchNo,
    'Name': s.name,
    'Designation': s.designation,
    'Visa Type': s.visaType,
    'Card No': s.cardNo,
    'Issue Date': s.issueDate,
    'Expire Date': s.expireDate,
    'Phone': s.phone,
    'Status': s.status,
    'Hotel': s.hotel,
    'Department': s.department,
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
      new TableCell({ children: [new Paragraph(s.designation || '')] }),
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
                new TableCell({ children: [new Paragraph('Designation')] }),
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
export const importFromJSON = (
  event: React.ChangeEvent<HTMLInputElement>,
  currentStaff: Staff[],
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (Array.isArray(data)) {
          const newStaff = data.map((item, index) => ({
            id: Math.max(...currentStaff.map(s => s.id), 0) + index + 1,
            sl: item.sl || Math.max(...currentStaff.map(s => s.sl), 0) + index + 1,
            batchNo: item.batchNo || '',
            name: item.name || '',
            designation: item.designation || '',
            visaType: item.visaType || '',
            cardNo: item.cardNo || '',
            issueDate: item.issueDate || '',
            expireDate: item.expireDate || '',
            phone: item.phone || '',
            status: item.status || 'Working',
            photo: item.photo || '',
            remark: item.remark || '',
            hotel: item.hotel || '',
            department: item.department || '',
            salary: item.salary || 0,
            passportExpireDate: item.passportExpireDate || ''
          }))
          setStaff([...currentStaff, ...newStaff])
          alert(`Successfully imported ${newStaff.length} staff members!`)
        }
      } catch (error) {
        alert('Error importing JSON file. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }
}

// Import from Excel
export const importFromExcel = (
  event: React.ChangeEvent<HTMLInputElement>,
  currentStaff: Staff[],
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        const newStaff = jsonData.map((item: any, index) => ({
          id: Math.max(...currentStaff.map(s => s.id), 0) + index + 1,
          sl: item['SL'] || item.sl || Math.max(...currentStaff.map(s => s.sl), 0) + index + 1,
          batchNo: item['Batch No'] || item.batchNo || '',
          name: item['Name'] || item.name || '',
          designation: item['Designation'] || item.designation || '',
          visaType: item['Visa Type'] || item.visaType || '',
          cardNo: item['Card No'] || item.cardNo || '',
          issueDate: item['Issue Date'] || item.issueDate || '',
          expireDate: item['Expire Date'] || item.expireDate || '',
          phone: item['Phone'] || item.phone || '',
          status: item['Status'] || item.status || 'Working',
          photo: item['Photo'] || item.photo || '',
          remark: item['Remark'] || item.remark || '',
          hotel: item['Hotel'] || item.hotel || '',
          department: item['Department'] || item.department || '',
          salary: item['Salary'] || item.salary || 0,
          passportExpireDate: item['Passport Expire Date'] || item.passportExpireDate || ''
        }))
        
        setStaff([...currentStaff, ...newStaff])
        alert(`Successfully imported ${newStaff.length} staff members from Excel!`)
      } catch (error) {
        alert('Error importing Excel file. Please check the file format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }
}
