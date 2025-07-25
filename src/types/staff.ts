export interface Staff {
  id: number
  sl: number
  batchNo: string
  name: string
  designation: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless' | 'Exited'
  photo: string
  remark: string
  hotel: string
  department: string
  salary: number
  passportExpireDate: string
}

export interface NewStaff {
  sl: number
  batchNo: string
  name: string
  designation: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless' | 'Exited'
  photo: string
  remark: string
  hotel: string
  department: string
  salary: number
  passportExpireDate: string
}

export interface SearchFilters {
  department: string
  salaryMin: string
  salaryMax: string
  passportExpireDate: string
  cardNumber: string
}

export interface StaffContextType {
  staff: Staff[]
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
  hotels: string[]
  setHotels: React.Dispatch<React.SetStateAction<string[]>>
  departments: string[]
  setDepartments: React.Dispatch<React.SetStateAction<string[]>>
}
