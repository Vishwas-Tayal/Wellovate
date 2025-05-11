const API_URL = 'http://localhost:5000/api';

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updateMedicalHistory: async (medicalData) => {
    const response = await fetch(`${API_URL}/users/medical-history`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(medicalData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updatePrivacySettings: async (privacyData) => {
    const response = await fetch(`${API_URL}/users/privacy-settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(privacyData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  changePassword: async (passwordData) => {
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_URL}/users/account`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
}; 