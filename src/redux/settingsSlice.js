import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define the initial state for settings
const initialState = {
  settings: [], // Array of settings
  loading: false,
  error: null,
};

// Async thunk to get settings
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/setting");
      return response.data.data; // Assuming the API returns an object with 'data' that contains an array of settings
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
      return response.data; // Assuming the API returns the updated settings
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
      return response.data; // Assuming it returns the default settings
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
        state.settings = action.payload; // Store fetched settings
        state.error = null; // Clear any previous errors
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

      // Handle updateSettings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the API returns the updated settings array or individual settings
        const updatedSetting = action.payload;
        const updatedSettings = state.settings.map((setting) =>
          setting.setting_name === updatedSetting.setting_name
            ? { ...setting, setting_value: updatedSetting.setting_value }
            : setting
        );
        state.settings = updatedSettings; // Update the settings array
        state.error = null; // Clear any previous errors
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

      // Handle resetSettings
      .addCase(resetSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload; // Set the default settings
        state.error = null; // Clear any previous errors
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
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
