import axios from 'axios';

const API_BASE_URL = 'http://18.184.52.10:5003/api/v1/ums';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    console.warn('API Error:', error.message);
    throw error.response?.data || error;
  }
);

// Mock data for demonstration when API is unavailable
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'Manager',
    isActive: true,
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    role: 'User',
    isActive: false,
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    isActive: true,
    createdAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Wilson',
    email: 'charlie.wilson@example.com',
    role: 'Manager',
    isActive: true,
    createdAt: '2024-01-19T11:30:00Z'
  },
  {
    id: 6,
    firstName: 'Diana',
    lastName: 'Davis',
    email: 'diana.davis@example.com',
    role: 'User',
    isActive: false,
    createdAt: '2024-01-20T13:20:00Z'
  }
];

let mockUserData = [...mockUsers];

// Authentication APIs
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
    }
    return response;
  } catch (error) {
    // Mock login for demo
    if (email === 'admin@example.com' && password === 'admin123') {
      const mockResponse = {
        token: 'mock-jwt-token-admin',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          role: 'Admin'
        }
      };
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      return mockResponse;
    }
    throw new Error('Invalid credentials');
  }
};

export const register = async (userData) => {
  try {
    return await api.post('/auth/register', userData);
  } catch (error) {
    // Mock registration
    return { success: true, message: 'Registration successful (mock)' };
  }
};

export const forgotPassword = async (email) => {
  try {
    return await api.post('/auth/forgot-password', { email });
  } catch (error) {
    return { success: true, message: 'Password reset email sent (mock)' };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    return await api.post('/auth/reset-password', { email, otp, newPassword });
  } catch (error) {
    return { success: true, message: 'Password reset successful (mock)' };
  }
};

export const validateToken = async (token) => {
  try {
    return await api.post('/auth/validate', { token });
  } catch (error) {
    return { valid: false };
  }
};

// Admin APIs - Updated with new endpoints
export const getUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append('Role', filters.role);
    if (filters.isActive !== undefined) params.append('IsActive', filters.isActive);
    if (filters.page) params.append('Page', filters.page);
    if (filters.limit) params.append('Limit', filters.limit);
    
    const response = await api.get(`/api/users?${params.toString()}`);
    return response;
  } catch (error) {
    console.info('Using mock data for demonstration');
    let filteredData = [...mockUserData];
    
    if (filters.role) {
      filteredData = filteredData.filter(user => 
        user.role.toLowerCase() === filters.role.toLowerCase()
      );
    }
    
    if (filters.isActive !== undefined) {
      filteredData = filteredData.filter(user => user.isActive === filters.isActive);
    }
    
    return filteredData;
  }
};

export const getUserById = async (userId) => {
  try {
    return await api.get(`/api/users/${userId}`);
  } catch (error) {
    const user = mockUserData.find(u => u.id === userId);
    if (user) return user;
    throw new Error('User not found');
  }
};

export const updateUser = async (userId, userData) => {
  try {
    return await api.put(`/api/users/${userId}`, userData);
  } catch (error) {
    const userIndex = mockUserData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex] = { ...mockUserData[userIndex], ...userData };
    }
    return { success: true, message: 'User updated successfully (mock)' };
  }
};

export const deleteUser = async (userId) => {
  try {
    return await api.delete(`/api/users/${userId}`);
  } catch (error) {
    mockUserData = mockUserData.filter(user => user.id !== userId);
    return { success: true, message: 'User deleted successfully (mock)' };
  }
};

export const suspendUser = async (userId) => {
  try {
    return await api.post(`/api/users/${userId}/suspend`);
  } catch (error) {
    const userIndex = mockUserData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex].isActive = false;
    }
    return { success: true, message: 'User suspended successfully (mock)' };
  }
};

export const activateUser = async (userId) => {
  try {
    return await api.post(`/api/users/${userId}/activate`);
  } catch (error) {
    const userIndex = mockUserData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex].isActive = true;
    }
    return { success: true, message: 'User activated successfully (mock)' };
  }
};

export const activateAllUsers = async () => {
  try {
    return await api.post('/api/users/activate-all');
  } catch (error) {
    mockUserData = mockUserData.map(user => ({ ...user, isActive: true }));
    return { success: true, message: 'All users activated successfully (mock)' };
  }
};

export const setUserRole = async (userId, role) => {
  try {
    return await api.put(`/admin/set-role/${userId}`, { role });
  } catch (error) {
    const userIndex = mockUserData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex].role = role;
    }
    return { success: true, message: 'Role updated successfully (mock)' };
  }
};

// User APIs
export const getUserProfile = async () => {
  try {
    return await api.get('/user/profile');
  } catch (error) {
    return {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'Admin'
    };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    return await api.put('/user/profile', profileData);
  } catch (error) {
    return { success: true, message: 'Profile updated successfully (mock)' };
  }
};

export const changePassword = async (passwordData) => {
  try {
    return await api.put('/user/change-password', passwordData);
  } catch (error) {
    return { success: true, message: 'Password changed successfully (mock)' };
  }
};

export const deleteAccount = async () => {
  try {
    return await api.delete('/user/delete-account');
  } catch (error) {
    return { success: true, message: 'Account deleted successfully (mock)' };
  }
};

export default api;