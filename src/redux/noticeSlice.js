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
    return response.data.data;
  }
);

// Async thunk to edit any notice
export const editNotice = createAsyncThunk(
  "notices/editNotice",
  async ({ id, noticeData }) => {
    const response = await api.put(`/notices/${id}`, noticeData);
    return response.data;
  }
);

// Async thunk to delete any notice
export const deleteNotice = createAsyncThunk(
  "notices/deleteNotice",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notices/${id}`);
      return id; // Return ID so we can remove it from the state
    } catch (error) {
      console.error("Error in deleteNotice:", error); // Log the error for more insights
      return rejectWithValue(error.response?.data || error.message); // Provide more specific error information
    }
  }
);

// Other thunks here...
// Async thunk to get public notices
export const getPublicNotices = createAsyncThunk(
  "notices/getPublicNotices",
  async () => {
    const response = await api.get("/notices");
    return response.data.data;
  }
);

// Async thunk to get private notices
export const getPrivateNotices = createAsyncThunk(
  "notices/getPrivateNotices",
  async () => {
    const response = await api.post("/notices/mineNotice");
    return response.data.data;
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
    const response = await api.put(`/notices/${id}`, noticeData);
    return response.data;
  }
);

// Async thunk to update a private notice
export const updatePrivateNotice = createAsyncThunk(
  "notices/updatePrivateNotice",
  async ({ id, noticeData }) => {
    const response = await api.put(`/notices/private/${id}`, noticeData);
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

      // Add Public Notice
      .addCase(addPublicNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPublicNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.publicNotices.push(action.payload);
        state.allNotices.push(action.payload);
      })
      .addCase(addPublicNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Private Notice
      .addCase(addPrivateNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPrivateNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.privateNotices.push(action.payload);
        state.allNotices.push(action.payload);
      })
      .addCase(addPrivateNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Public Notice
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
        const allIndex = state.allNotices.findIndex(
          (notice) => notice.id === action.payload.id
        );
        if (allIndex !== -1) {
          state.allNotices[allIndex] = action.payload;
        }
      })
      .addCase(updatePublicNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Private Notice
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
        const allIndex = state.allNotices.findIndex(
          (notice) => notice.id === action.payload.id
        );
        if (allIndex !== -1) {
          state.allNotices[allIndex] = action.payload;
        }
      })
      .addCase(updatePrivateNotice.rejected, (state, action) => {
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
