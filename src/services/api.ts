import { User, AuthResponse, LoginCredentials, RegisterData, ProfileData, MedicalHistoryData, PrivacySettingsData, PasswordData } from '../types';

// Update API URL to match your backend server
const API_URL = 'http://localhost:5000/api'; // Changed back to port 5000

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    throw new Error('Unable to connect to the server. Please check if the server is running.');
  }
  throw error;
};

// Auth API calls
export const authAPI = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // Log the exact data being sent (excluding password)
      const { password, ...logData } = userData;
      console.log('Sending registration request with data:', logData);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (!response.ok) {
        console.error('Registration failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      handleApiError(error);
      throw error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Sending login request for username:', credentials.username);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Login failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      handleApiError(error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Get current user failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || 'Failed to get current user');
      }
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      handleApiError(error);
      throw error;
    }
  },
};

// User API calls
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updateProfile: async (profileData: ProfileData): Promise<User> => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updateMedicalHistory: async (medicalData: MedicalHistoryData): Promise<MedicalHistoryData> => {
    const response = await fetch(`${API_URL}/users/medical-history`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(medicalData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updatePrivacySettings: async (privacyData: PrivacySettingsData): Promise<PrivacySettingsData> => {
    const response = await fetch(`${API_URL}/users/privacy-settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(privacyData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  changePassword: async (passwordData: PasswordData): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/users/account`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
}; 