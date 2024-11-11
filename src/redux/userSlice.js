import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

const initialState = {
  residences: [],
  loading: false,
  error: null,
};

// Async thunk to fetch residences
export const fetchResidences = createAsyncThunk(
  "user/fetchResidences",
  async () => {
    const response = await api.post("notices/userlist");
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResidences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResidences.fulfilled, (state, action) => {
        state.loading = false;
        state.residences = action.payload;
      })
      .addCase(fetchResidences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export const userReducer = userSlice.reducer;
