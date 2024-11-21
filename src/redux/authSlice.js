import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/login?login_id=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );
      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data)); // Store user info
      return data;
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Invalid credentials"
      ) {
        return rejectWithValue("Invalid credentials");
      } else {
        return rejectWithValue("An error occurred. Please try again later.");
      }
    }
  }
);

// Thunk for editing profile
export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/profile/${userId}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      // Update localStorage to persist the updated user info
      const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
      updatedUser.user = { ...updatedUser.user, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Edit Profile
      .addCase(editProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.user = { ...state.user.user, ...action.payload }; // Update user in the state
        }
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
