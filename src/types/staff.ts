export interface Staff {
  _id?: string  // MongoDB ObjectId
  id: number
  sl: number
  batchNo: string
  name: string
  department: string
  company: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless' | 'Exited' | ''
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
  company: string
  visaType: 'Employment' | 'Visit' | ''
  cardNo: string
  issueDate: string
  expireDate: string
  phone: string
  status: 'Working' | 'Jobless' | 'Exited' | ''
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
  companies: string[]
  setCompanies: React.Dispatch<React.SetStateAction<string[]>>
  departments: string[]
  setDepartments: React.Dispatch<React.SetStateAction<string[]>>
  loadRealData: () => Promise<boolean>
  saveToJsonFile: () => void
  loadFromJsonFile: () => Promise<boolean>
  hasUnsavedChanges: boolean
  addStaffToAPI: (staffData: any) => Promise<Staff>
  updateStaffInAPI: (id: string, staffData: any) => Promise<Staff>
  deleteStaffFromAPI: (id: string) => Promise<void>
  bulkDeleteFromAPI: (ids: string[]) => Promise<void>
  bulkUpdateHotelInAPI: (ids: string[], hotel: string) => Promise<void>
  bulkUpdateStatusInAPI: (ids: string[], status: string) => Promise<void>
  addHotelToAPI: (name: string) => Promise<void>
  deleteHotelFromAPI: (name: string) => Promise<void>
  addCompanyToAPI: (name: string) => Promise<void>
  deleteCompanyFromAPI: (name: string) => Promise<void>
  addDepartmentToAPI: (name: string) => Promise<void>
  deleteDepartmentFromAPI: (name: string) => Promise<void>
}
