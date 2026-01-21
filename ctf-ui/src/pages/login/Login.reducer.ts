import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginRequestPayload, AuthSubState } from './Login.interface';

const initialSubState: AuthSubState = {
  data: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  loading: false,
  error: null,
};

export const initialState: AuthState = {
  login: { ...initialSubState },
  currentUser: { ...initialSubState },
  isAuthenticated: !!localStorage.getItem('authToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginProgress: (state) => {
      state.login.loading = true;
      state.login.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.login.loading = false;
      state.login.data = action.payload;
      state.isAuthenticated = true;
      state.login.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.login.loading = false;
      state.login.data = null;
      state.login.error = action.payload;
      state.isAuthenticated = false;
    },
    fetchUserProgress: (state) => {
      state.currentUser.loading = true;
      state.currentUser.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser.loading = false;
      state.currentUser.data = action.payload;
      state.isAuthenticated = true;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.currentUser.loading = false;
      state.currentUser.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.login = { ...initialSubState, data: null };
      state.currentUser = { ...initialSubState, data: null };
      state.isAuthenticated = false;
    },
    clearAuthErrors: (state) => {
      state.login.error = null;
      state.currentUser.error = null;
    }
  },
});

export const authActions = {
  requestLogin: createAction<LoginRequestPayload>(`${authSlice.name}/requestLogin`),
  requestLogout: createAction(`${authSlice.name}/requestLogout`),
  requestFetchUser: createAction(`${authSlice.name}/requestFetchUser`),
  
  ...authSlice.actions
};

export default authSlice.reducer;