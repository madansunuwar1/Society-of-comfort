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

// Async thunk to add a setting
export const addSettings = createAsyncThunk(
  "settings/addSettings",
  async (newSetting, { rejectWithValue }) => {
    try {
      const response = await api.post("/setting", newSetting);
      return response.data; // Assuming the API returns the added setting
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to add setting");
    }
  }
);

// Async thunk to update a setting
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async ({ settingId, settingsData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/setting/${settingId}`, settingsData);
      return response.data; // Assuming the API returns the updated settings
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to update settings"
      );
    }
  }
);

// Async thunk to delete a setting
export const deleteSettings = createAsyncThunk(
  "settings/deleteSettings",
  async (settingId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/setting/${settingId}`);
      return settingId; // Assuming the API returns the ID of the deleted setting
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to delete setting"
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

      // Handle addSettings
      .addCase(addSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings.push(action.payload); // Add the new setting to the state
        state.error = null; // Clear any previous errors
      })
      .addCase(addSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

      // Handle updateSettings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
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

      // Handle deleteSettings
      .addCase(deleteSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = state.settings.filter(
          (setting) => setting.id !== action.payload // Remove the deleted setting from the array
        );
        state.error = null; // Clear any previous errors
      })
      .addCase(deleteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

// Export the actions and reducer
export const settingsReducer = settingsSlice.reducer;
export const settingsActions = {
  getSettings,
  addSettings,
  updateSettings,
  deleteSettings,
};
