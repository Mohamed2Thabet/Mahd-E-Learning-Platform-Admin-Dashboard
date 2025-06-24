import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = '/api/v1/ums/admin';
const USERS_URL = '/api/users';
const AUTH_URL = '/api/v1/ums/auth';


const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

// ------------------ Thunks ------------------

export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async ({ email, password }, thunkAPI) => {
    console.log(email)
    console.log(password)
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.accessToken) localStorage.setItem('token', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const token = localStorage.getItem('token');
  localStorage.clear();

  if (token) {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Logout error:', err);
    }
  }

  return {};
});
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ role, isActive, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (role) params.append('Role', role);
      if (isActive !== undefined) params.append('IsActive', isActive);
      params.append('Page', page);
      params.append('Limit', limit);

      const res = await fetch(`${USERS_URL}?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${USERS_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await fetch(`${USERS_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${USERS_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete user');
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async (id, thunkAPI) => {
    
    try {
      const res = await fetch(`${USERS_URL}/${id}/suspend`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to suspend user');
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const activateUser = createAsyncThunk(
  'admin/activateUser',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${USERS_URL}/${id}/activate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to activate user');
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const setUserRole = createAsyncThunk(
  'admin/setUserRole',
  async ({ userId, role }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/set-role/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to set user role');
      return { userId, role };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteUserPermanent = createAsyncThunk(
  'admin/deleteUserPermanent',
  async (userId, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/delete-user/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to permanently delete user');
      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ------------------ Slice ------------------

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('admin/') &&
          action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('admin/') &&
          action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default adminSlice.reducer;
