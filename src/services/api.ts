const API_BASE_URL = 'http://localhost:3000/api';

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
    return response.json();
  }

  static async updateStaff(id: string, staffData: any) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    if (!response.ok) throw new Error('Failed to update staff member');
    return response.json();
  }

  static async deleteStaff(id: string) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete staff member');
    return response.json();
  }

  static async bulkOperation(action: string, ids: string[], data?: any) {
    const response = await fetch(`${API_BASE_URL}/staff/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids, data })
    });
    if (!response.ok) throw new Error('Failed to perform bulk operation');
    return response.json();
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
    return response.json();
  }

  static async deleteHotel(name: string) {
    const response = await fetch(`${API_BASE_URL}/hotels/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete hotel');
    return response.json();
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
    return response.json();
  }

  static async deleteCompany(name: string) {
    const response = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete company');
    return response.json();
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
    return response.json();
  }

  static async deleteDepartment(name: string) {
    const response = await fetch(`${API_BASE_URL}/departments/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete department');
    return response.json();
  }

  // Health check
  static async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  }
}

export default StaffAPI;
