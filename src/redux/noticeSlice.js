import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api"; // Adjust the import path accordingly

// Define the initial state for notices
const initialState = {
  publicNotices: [],
  privateNotices: [],
  loading: false,
  error: null,
};

// Async thunk to get public notices
export const getPublicNotices = createAsyncThunk(
  "notices/getPublicNotices",
  async () => {
    const response = await api.get("/notices");
    return response.data;
  }
);

// Async thunk to get private notices
export const getPrivateNotices = createAsyncThunk(
  "notices/getPrivateNotices",
  async () => {
    const response = await api.post("/notices/mineNotice");
    return response.data;
  }
);

// Async thunk to add a public notice
export const addPublicNotice = createAsyncThunk(
  "notices/addPublicNotice",
  async (noticeData) => {
    const response = await api.post("/notices", noticeData);
    return response.data;
  }
);

// Async thunk to add a private notice
export const addPrivateNotice = createAsyncThunk(
  "notices/addPrivateNotice",
  async (noticeData) => {
    const response = await api.post("/notices/private", noticeData);
    return response.data;
  }
);

// Async thunk to update a public notice
export const updatePublicNotice = createAsyncThunk(
  "notices/updatePublicNotice",
  async ({ id, noticeData }) => {
    const response = await api.put(
      `/v1/bazaar/notices/public/update/${id}/`,
      noticeData
    );
    return response.data;
  }
);

// Async thunk to update a private notice
export const updatePrivateNotice = createAsyncThunk(
  "notices/updatePrivateNotice",
  async ({ id, noticeData }) => {
    const response = await api.put(
      `/v1/bazaar/notices/private/update/${id}/`,
      noticeData
    );
    return response.data;
  }
);

// Create the notice slice
const noticeSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPublicNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPublicNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.publicNotices = action.payload;
      })
      .addCase(getPublicNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getPrivateNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPrivateNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.privateNotices = action.payload;
      })
      .addCase(getPrivateNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPublicNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPublicNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.publicNotices.push(action.payload);
      })
      .addCase(addPublicNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPrivateNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPrivateNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.privateNotices.push(action.payload);
      })
      .addCase(addPrivateNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePublicNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePublicNotice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publicNotices.findIndex(
          (notice) => notice.id === action.payload.id
        );
        if (index !== -1) {
          state.publicNotices[index] = action.payload;
        }
      })
      .addCase(updatePublicNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePrivateNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePrivateNotice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.privateNotices.findIndex(
          (notice) => notice.id === action.payload.id
        );
        if (index !== -1) {
          state.privateNotices[index] = action.payload;
        }
      })
      .addCase(updatePrivateNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const noticeReducer = noticeSlice.reducer;
export const noticeActions = {
  getPublicNotices,
  getPrivateNotices,
  addPublicNotice,
  addPrivateNotice,
  updatePublicNotice,
  updatePrivateNotice,
};
