// Environment-aware API configuration
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback logic
  if (import.meta.env.PROD) {
    // Production fallback - your actual Render URL
    return 'https://staff-management-api-hzq0.onrender.com/api';
  }
  
  // Development default
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

class StaffAPI {
  // Staff API calls
  static async getAllStaff() {
    const response = await fetch(`${API_BASE_URL}/staff`);
    if (!response.ok) throw new Error('Failed to fetch staff');
    const result = await response.json();
    // Handle different response formats from external server
    return result.data || result;
  }

  static async getStaff(id: string) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`);
    if (!response.ok) throw new Error('Failed to fetch staff member');
    return response.json();
  }

  static async createStaff(staffData: any) {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    if (!response.ok) throw new Error('Failed to create staff member');
    const result = await response.json();
    return result.data || result;
  }

  static async updateStaff(id: string, staffData: any) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    if (!response.ok) throw new Error('Failed to update staff member');
    const result = await response.json();
    return result.data || result;
  }

  static async deleteStaff(id: string) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete staff member');
    const result = await response.json();
    return result.data || result;
  }

  static async bulkOperation(action: string, ids: string[], data?: any) {
    const response = await fetch(`${API_BASE_URL}/staff/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids, data })
    });
    if (!response.ok) throw new Error('Failed to perform bulk operation');
    const result = await response.json();
    return result.data || result;
  }

  static async bulkDelete(ids: string[]) {
    return this.bulkOperation('delete', ids);
  }

  static async bulkUpdateHotel(ids: string[], hotel: string) {
    return this.bulkOperation('updateHotel', ids, { hotel });
  }

  static async bulkUpdateStatus(ids: string[], status: string) {
    return this.bulkOperation('updateStatus', ids, { status });
  }

  static async bulkImport(staffData: any[]) {
    return this.bulkOperation('import', [], staffData);
  }

  // Hotels API calls
  static async getHotels() {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    if (!response.ok) throw new Error('Failed to fetch hotels');
    const result = await response.json();
    return result.data || result;
  }

  static async addHotel(name: string) {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to add hotel');
    const result = await response.json();
    return result.data || result;
  }

  static async deleteHotel(name: string) {
    const response = await fetch(`${API_BASE_URL}/hotels/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete hotel');
    const result = await response.json();
    return result.data || result;
  }

  // Companies API calls
  static async getCompanies() {
    const response = await fetch(`${API_BASE_URL}/companies`);
    if (!response.ok) throw new Error('Failed to fetch companies');
    const result = await response.json();
    return result.data || result;
  }

  static async addCompany(name: string) {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to add company');
    const result = await response.json();
    return result.data || result;
  }

  static async deleteCompany(name: string) {
    const response = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete company');
    const result = await response.json();
    return result.data || result;
  }

  // Departments API calls
  static async getDepartments() {
    const response = await fetch(`${API_BASE_URL}/departments`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    const result = await response.json();
    return result.data || result;
  }

  static async addDepartment(name: string) {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to add department');
    const result = await response.json();
    return result.data || result;
  }

  static async deleteDepartment(name: string) {
    const response = await fetch(`${API_BASE_URL}/departments/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete department');
    const result = await response.json();
    return result.data || result;
  }

  // Health check
  static async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  }

  // Vacation API calls
  static async getAllVacations() {
    const response = await fetch(`${API_BASE_URL}/vacations`);
    if (!response.ok) throw new Error('Failed to fetch vacations');
    const result = await response.json();
    return result.data || result;
  }

  static async createVacation(vacationData: any) {
    const response = await fetch(`${API_BASE_URL}/vacations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacationData)
    });
    if (!response.ok) throw new Error('Failed to create vacation request');
    const result = await response.json();
    return result.data || result;
  }

  static async updateVacation(id: string, vacationData: any) {
    console.log(`🔄 StaffAPI: Sending PUT request to /vacations/${id}`, vacationData);
    
    const response = await fetch(`${API_BASE_URL}/vacations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacationData)
    });
    
    console.log(`📡 StaffAPI: Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ StaffAPI: Error response:', errorText);
      throw new Error(`Failed to update vacation request: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ StaffAPI: Update successful:', result);
    return result.data || result;
  }

  static async deleteVacation(id: string) {
    const response = await fetch(`${API_BASE_URL}/vacations/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete vacation request');
    const result = await response.json();
    return result.data || result;
  }

  static async getVacationStats() {
    const response = await fetch(`${API_BASE_URL}/vacations/stats`);
    if (!response.ok) throw new Error('Failed to fetch vacation statistics');
    const result = await response.json();
    return result.data || result;
  }
}

export default StaffAPI;
