import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/config";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: sessionStorage.getItem("token") ? JSON.parse(sessionStorage.getItem("token")) : null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    const response = await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkauth",
  async () => {
    const token = sessionStorage.getItem("token")
      ? JSON.parse(sessionStorage.getItem("token"))
      : null;

    const response = await axios.get(
      `${API_URL}/api/auth/check-auth`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    resetTokenAndCredentials: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; })
      .addCase(registerUser.rejected, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; })

      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null; 
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUser.rejected, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; state.token = null; })

      .addCase(checkAuth.pending, (state) => { state.isLoading = true; })
      .addCase(checkAuth.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.success ? action.payload.user : null; state.isAuthenticated = action.payload.success; })
      .addCase(checkAuth.rejected, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; state.token = null; sessionStorage.removeItem("token"); })

      .addCase(logoutUser.fulfilled, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; state.token = null; sessionStorage.removeItem("token"); });
  },
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer; // <-- ONLY ONE DEFAULT EXPORT
