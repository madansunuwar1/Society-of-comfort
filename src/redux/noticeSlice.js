import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api"; // Adjust the import path accordingly

// Define the initial state for notices
const initialState = {
  publicNotices: [],
  privateNotices: [],
  allNotices: [], // New state to store all notices
  loading: false,
  error: null,
};

// Async thunk to get all notices
export const getAllNotices = createAsyncThunk(
  "notices/getAllNotices",
  async () => {
    const response = await api.get("/notices");
    return response.data;
  }
);

// Async thunk to edit any notice
export const editNotice = createAsyncThunk(
  "notices/editNotice",
  async ({ id, noticeData }) => {
    const response = await api.put(`/notices/${id}/`, noticeData);
    return response.data;
  }
);

// Async thunk to delete any notice
export const deleteNotice = createAsyncThunk(
  "notices/deleteNotice",
  async (id) => {
    await api.delete(`/notices/${id}/`);
    return id; // Return ID so we can remove it from the state
  }
);

// Other thunks here...
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
      .addCase(getAllNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotices = action.payload;
      })
      .addCase(getAllNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(editNotice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allNotices.findIndex(
          (notice) => notice.id === action.payload.id
        );
        if (index !== -1) {
          state.allNotices[index] = action.payload;
        }
      })
      .addCase(editNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotices = state.allNotices.filter(
          (notice) => notice.id !== action.payload
        );
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Add other case handlers for public/private notices...
  },
});

// Export the actions and reducer
export const noticeReducer = noticeSlice.reducer;
export const noticeActions = {
  getAllNotices,
  getPublicNotices,
  getPrivateNotices,
  addPublicNotice,
  addPrivateNotice,
  updatePublicNotice,
  updatePrivateNotice,
  editNotice,
  deleteNotice,
};
