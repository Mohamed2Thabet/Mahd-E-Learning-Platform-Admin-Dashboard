import axios from "axios";

// Use environment variables if available, otherwise use proxy paths for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/auth";
const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || "/api/users";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    "X-Service-Key":
      import.meta.env.VITE_INTERNAL_API_KEY || "default-service-key",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Helper function for API requests
const makeRequest = async (url, options = {}) => {
  try {
    const response = await axios({
      url,
      timeout: 5000,
      headers: getAuthHeaders(),
      ...options,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    console.warn("API Error:", error.message);
    throw error.response?.data || error;
  }
};

// Mock data for demonstration when API is unavailable
const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Admin",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    isActive: true,
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    role: "User",
    isActive: false,
    createdAt: "2024-01-17T09:15:00Z",
  },
  {
    id: 4,
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@example.com",
    role: "User",
    isActive: true,
    createdAt: "2024-01-18T16:45:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Wilson",
    email: "charlie.wilson@example.com",
    role: "Manager",
    isActive: true,
    createdAt: "2024-01-19T11:30:00Z",
  },
  {
    id: 6,
    firstName: "Diana",
    lastName: "Davis",
    email: "diana.davis@example.com",
    role: "User",
    isActive: false,
    createdAt: "2024-01-20T13:20:00Z",
  },
];

let mockUserData = [...mockUsers];

// Authentication APIs
export const login = async (email, password) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      data: { email, password },
    });
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
    }
    return response;
  } catch (error) {
    // Mock login for demo
    if (email === "admin@example.com" && password === "admin123") {
      const mockResponse = {
        token: "mock-jwt-token-admin",
        refreshToken: "mock-refresh-token",
        user: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          role: "Admin",
        },
      };
      localStorage.setItem("accessToken", mockResponse.token);
      localStorage.setItem("refreshToken", mockResponse.refreshToken);
      return mockResponse;
    }
    throw new Error("Invalid credentials");
  }
};

export const register = async (userData) => {
  try {
    return await makeRequest(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      data: userData,
    });
  } catch (error) {
    // Mock registration
    return { success: true, message: "Registration successful (mock)" };
  }
};

export const forgotPassword = async (email) => {
  try {
    return await makeRequest(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      data: { email },
    });
  } catch (error) {
    return { success: true, message: "Password reset email sent (mock)" };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    return await makeRequest(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      data: { email, otp, newPassword },
    });
  } catch (error) {
    return { success: true, message: "Password reset successful (mock)" };
  }
};

export const validateToken = async (token) => {
  try {
    return await makeRequest(`${API_BASE_URL}/auth/validate`, {
      method: "POST",
      data: { token },
    });
  } catch (error) {
    return { valid: false };
  }
};

// Admin APIs - Updated with new endpoints
export const getUsers = async (filters = {}) => {
  try {
    const response = await axios.get(API_ADMIN_URL, {
      params: filters,
      headers: getAuthHeaders(),
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.info("Using mock data for demonstration");
    let filteredData = [...mockUserData];

    if (filters.role) {
      filteredData = filteredData.filter(
        (user) => user.role.toLowerCase() === filters.role.toLowerCase()
      );
    }

    if (filters.isActive !== undefined) {
      filteredData = filteredData.filter(
        (user) => user.isActive === filters.isActive
      );
    }

    return filteredData;
  }
};

export const getUserById = async (userId) => {
  try {
    return await makeRequest(`${API_ADMIN_URL}/${userId}`, {
      method: "GET",
    });
  } catch (error) {
    const user = mockUserData.find((u) => u.id === userId);
    if (user) return user;
    throw new Error("User not found");
  }
};

export const updateUser = async (userId, userData) => {
  try {
    return await makeRequest(`${API_ADMIN_URL}/${userId}`, {
      method: "PUT",
      data: userData,
    });
  } catch (error) {
    const userIndex = mockUserData.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex] = { ...mockUserData[userIndex], ...userData };
    }
    return { success: true, message: "User updated successfully (mock)" };
  }
};

export const deleteUser = async (userId) => {
  try {
    return await makeRequest(`${API_ADMIN_URL}/${userId}`, {
      method: "DELETE",
    });
  } catch (error) {
    mockUserData = mockUserData.filter((user) => user.id !== userId);
    return { success: true, message: "User deleted successfully (mock)" };
  }
};

export const suspendUser = async (userId) => {
  try {
    return await makeRequest(`${API_ADMIN_URL}/${userId}/suspend`, {
      method: "POST",
    });
  } catch (error) {
    const userIndex = mockUserData.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex].isActive = false;
    }
    return { success: true, message: "User suspended successfully (mock)" };
  }
};

export const activateUser = async (userId) => {
  try {
    return await makeRequest(`${API_ADMIN_URL}/${userId}/activate`, {
      method: "POST",
    });
  } catch (error) {
    const userIndex = mockUserData.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex].isActive = true;
    }
    return { success: true, message: "User activated successfully (mock)" };
  }
};

export const activateAllUsers = async () => {
  try {
    return await makeRequest(`${API_ADMIN_URL}/activate-all`, {
      method: "POST",
    });
  } catch (error) {
    mockUserData = mockUserData.map((user) => ({ ...user, isActive: true }));
    return {
      success: true,
      message: "All users activated successfully (mock)",
    };
  }
};

export const setUserRole = async (userId, role) => {
  try {
    return await makeRequest(`${API_BASE_URL}/admin/set-role/${userId}`, {
      method: "PUT",
      data: { role },
    });
  } catch (error) {
    const userIndex = mockUserData.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      mockUserData[userIndex].role = role;
    }
    return { success: true, message: "Role updated successfully (mock)" };
  }
};

// User APIs
export const getUserProfile = async () => {
  try {
    return await makeRequest(`${API_BASE_URL}/user/profile`, {
      method: "GET",
    });
  } catch (error) {
    return {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: "Admin",
    };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    return await makeRequest(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      data: profileData,
    });
  } catch (error) {
    return { success: true, message: "Profile updated successfully (mock)" };
  }
};

export const changePassword = async (passwordData) => {
  try {
    return await makeRequest(`${API_BASE_URL}/user/change-password`, {
      method: "PUT",
      data: passwordData,
    });
  } catch (error) {
    return { success: true, message: "Password changed successfully (mock)" };
  }
};

export const deleteAccount = async () => {
  try {
    return await makeRequest(`${API_BASE_URL}/user/delete-account`, {
      method: "DELETE",
    });
  } catch (error) {
    return { success: true, message: "Account deleted successfully (mock)" };
  }
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  validateToken,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  activateAllUsers,
  setUserRole,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  makeRequest,
  getAuthHeaders,
  mockUsers,
  mockUserData,
  API_BASE_URL,
  API_ADMIN_URL,
  showAlert: (type, message) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  },
  showMockData: () => {
    console.info("Using mock data for demonstration");
    return mockUserData;
  },
};
