import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI} from '../../api/authAPI';

// 异步action
export const login = createAsyncThunk(
  'auth/login',
  async ({phone, password}, {rejectWithValue}) => {
    try {
      const response = await authAPI.login(phone, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '登录失败');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async ({phone, password, verifyCode}, {rejectWithValue}) => {
    try {
      const response = await authAPI.register(phone, password, verifyCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '注册失败');
    }
  },
);

export const sendVerifyCode = createAsyncThunk(
  'auth/sendVerifyCode',
  async ({phone, type}, {rejectWithValue}) => {
    try {
      const response = await authAPI.sendVerifyCode(phone, type);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '发送验证码失败');
    }
  },
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userInfo;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userInfo;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Verify Code
      .addCase(sendVerifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerifyCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendVerifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {logout, clearError} = authSlice.actions;
export default authSlice.reducer; 