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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
