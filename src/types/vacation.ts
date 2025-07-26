export interface VacationRequest {
  id: number
  staffId: number
  staffName: string
  staffBatch: string
  requestDate: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Ongoing' | 'Completed' | 'Cancelled'
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
  actualStartDate?: string
  actualEndDate?: string
  actualDays?: number
  salaryHold: number
  salaryAdvance: number
  salaryNote: string
  emergencyContact: string
  destination: string
  createdAt: string
  updatedAt: string
}

export interface NewVacationRequest {
  staffId: number
  startDate: string
  endDate: string
  reason: string
  salaryHold: number
  salaryAdvance: number
  salaryNote: string
  emergencyContact: string
  destination: string
}

export interface VacationFilters {
  status: string
  staffName: string
  dateRange: string
  hotel: string
}

export interface VacationStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  ongoingVacations: number
  completedVacations: number
  rejectedRequests: number
  totalDaysRequested: number
  totalSalaryHeld: number
  totalAdvanceGiven: number
}
