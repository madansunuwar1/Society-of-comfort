import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define the initial state for settings
const initialState = {
  settings: {},
  loading: false,
  error: null,
};

// Async thunk to get settings
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/setting");
      return response.data.data; // Assuming the API returns an object with settings
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to fetch settings"
      );
    }
  }
);

// Async thunk to update settings
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await api.post("/setting", settingsData);
      return response.data; // Return updated settings data
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to update settings"
      );
    }
  }
);

// Async thunk to reset settings to default
export const resetSettings = createAsyncThunk(
  "settings/resetSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/settings/reset");
      return response.data; // Return default settings data
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to reset settings"
      );
    }
  }
);

// Create the settings slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getSettings
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload; // Set the fetched settings
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateSettings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle resetSettings
      .addCase(resetSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload; // Set to default settings
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const settingsReducer = settingsSlice.reducer;
export const settingsActions = {
  getSettings,
  updateSettings,
  resetSettings,
};
