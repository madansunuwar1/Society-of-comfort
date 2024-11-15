import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define the initial state for house settings
const initialState = {
  houseSettings: [], // Array of house settings
  loading: false,
  error: null,
};

// Async thunk to get house settings
export const getHouseSettings = createAsyncThunk(
  "houseSettings/getHouseSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/houses");
      return response.data.data; // Assuming the API returns an object with 'data' containing an array of house settings
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to fetch house settings"
      );
    }
  }
);

// Async thunk to add a house setting
export const addHouseSetting = createAsyncThunk(
  "houseSettings/addHouseSetting",
  async (newHouseSetting, { rejectWithValue }) => {
    try {
      const response = await api.post("/houses", newHouseSetting);
      return response.data; // Assuming the API returns the added house setting
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to add house setting"
      );
    }
  }
);

// Async thunk to update a house setting
export const updateHouseSetting = createAsyncThunk(
  "houseSettings/updateHouseSetting",
  async ({ settingId, houseSettingData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/houses/${settingId}`, houseSettingData);
      return response.data; // Assuming the API returns the updated house setting
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to update house setting"
      );
    }
  }
);

// Async thunk to delete a house setting
export const deleteHouseSetting = createAsyncThunk(
  "houseSettings/deleteHouseSetting",
  async (settingId, { rejectWithValue }) => {
    try {
      await api.delete(`/houses/${settingId}`);
      return settingId; // Assuming the API returns the ID of the deleted house setting
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to delete house setting"
      );
    }
  }
);

// Create the houseSettings slice
const houseSettingsSlice = createSlice({
  name: "houseSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getHouseSettings
      .addCase(getHouseSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHouseSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.houseSettings = action.payload; // Store fetched house settings
        state.error = null; // Clear any previous errors
      })
      .addCase(getHouseSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

      // Handle addHouseSetting
      .addCase(addHouseSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(addHouseSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.houseSettings.push(action.payload); // Add the new house setting
        state.error = null; // Clear any previous errors
      })
      .addCase(addHouseSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

      // Handle updateHouseSetting
      .addCase(updateHouseSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHouseSetting.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSetting = action.payload;
        state.houseSettings = state.houseSettings.map((setting) =>
          setting.id === updatedSetting.id ? updatedSetting : setting
        );
        state.error = null; // Clear any previous errors
      })
      .addCase(updateHouseSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })

      // Handle deleteHouseSetting
      .addCase(deleteHouseSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHouseSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.houseSettings = state.houseSettings.filter(
          (setting) => setting.id !== action.payload // Remove the deleted house setting
        );
        state.error = null; // Clear any previous errors
      })
      .addCase(deleteHouseSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

// Export the actions and reducer
export const houseSettingsReducer = houseSettingsSlice.reducer;
export const houseSettingsActions = {
  getHouseSettings,
  addHouseSetting,
  updateHouseSetting,
  deleteHouseSetting,
};
