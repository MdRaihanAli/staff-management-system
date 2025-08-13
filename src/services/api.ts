// FIXED - Production API URL hardcoded
const API_BASE_URL = 'https://staff-management-api-hzq0.onrender.com/api';

console.log('🔗 API Base URL (PRODUCTION):', API_BASE_URL);

class StaffAPI {
  // Staff API calls
  static async getAllStaff() {
    try {
      console.log('📡 Fetching staff from:', `${API_BASE_URL}/staff`);
      const response = await fetch(`${API_BASE_URL}/staff`);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to fetch staff: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Staff data received:', result.data?.length || result.length, 'records');
      // Handle different response formats from external server
      return result.data || result;
    } catch (error) {
      console.error('🚨 Error fetching staff:', error);
      throw error;
    }
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
    try {
      console.log('📡 Fetching hotels from:', `${API_BASE_URL}/hotels`);
      const response = await fetch(`${API_BASE_URL}/hotels`);
      console.log('📊 Hotels response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Hotels API Error:', errorText);
        throw new Error(`Failed to fetch hotels: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Hotels data received:', result.data?.length || result.length, 'items');
      return result.data || result;
    } catch (error) {
      console.error('🚨 Error fetching hotels:', error);
      throw error;
    }
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
    try {
      console.log('📡 Fetching companies from:', `${API_BASE_URL}/companies`);
      const response = await fetch(`${API_BASE_URL}/companies`);
      console.log('📊 Companies response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Companies API Error:', errorText);
        throw new Error(`Failed to fetch companies: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Companies data received:', result.data?.length || result.length, 'items');
      return result.data || result;
    } catch (error) {
      console.error('🚨 Error fetching companies:', error);
      throw error;
    }
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
    try {
      console.log('📡 Fetching departments from:', `${API_BASE_URL}/departments`);
      const response = await fetch(`${API_BASE_URL}/departments`);
      console.log('📊 Departments response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Departments API Error:', errorText);
        throw new Error(`Failed to fetch departments: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Departments data received:', result.data?.length || result.length, 'items');
      return result.data || result;
    } catch (error) {
      console.error('🚨 Error fetching departments:', error);
      throw error;
    }
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
    const response = await fetch(`${API_BASE_URL}/vacations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacationData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update vacation request: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
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
