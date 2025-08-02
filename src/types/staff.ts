export interface Staff {
  id: number
  sl: number
  batchNo: string
  name: string
  department: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless' | 'Exited'
  photo: string
  remark: string
  hotel: string
  salary: number
  passportExpireDate: string
}

export interface NewStaff {
  sl: number
  batchNo: string
  name: string
  department: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless' | 'Exited'
  photo: string
  remark: string
  hotel: string
  salary: number
  passportExpireDate: string
}

export interface SearchFilters {
  passportExpireDate: string
  cardNumber: string
  status: string
}

export interface StaffContextType {
  staff: Staff[]
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>
  hotels: string[]
  setHotels: React.Dispatch<React.SetStateAction<string[]>>
  departments: string[]
  setDepartments: React.Dispatch<React.SetStateAction<string[]>>
  loadRealData: () => Promise<boolean>
}
