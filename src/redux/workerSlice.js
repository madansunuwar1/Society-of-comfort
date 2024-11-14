import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Initial state
const initialState = {
  workers: [],
  loading: false,
  error: null,
};

// Async thunk to fetch workers
export const fetchWorkers = createAsyncThunk(
  "worker/fetchWorkers",
  async () => {
    const response = await api.get("/workers"); // Assuming API endpoint for fetching workers
    return response.data.data;
  }
);

// Async thunk to add a new worker
export const addWorker = createAsyncThunk(
  "worker/addWorker",
  async (workerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/workers", workerData); // Assuming API endpoint for adding workers
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add worker");
    }
  }
);

// Async thunk to edit worker details
export const editWorker = createAsyncThunk(
  "worker/editWorker",
  async ({ workerId, workerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/workers/${workerId}`, workerData); // Assuming API endpoint for editing worker
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to edit worker");
    }
  }
);

// Async thunk to delete a worker
export const deleteWorker = createAsyncThunk(
  "worker/deleteWorker",
  async (workerId, { rejectWithValue }) => {
    try {
      await api.delete(`/workers/${workerId}`); // Assuming API endpoint for deleting worker
      return workerId; // Return workerId to remove from the state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete worker");
    }
  }
);

// Create the worker slice
const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch workers
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Add worker
      .addCase(addWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.workers.push(action.payload); // Add new worker to state
        state.error = null;
      })
      .addCase(addWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Edit worker
      .addCase(editWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editWorker.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workers.findIndex(
          (worker) => worker.id === action.payload.id
        );
        if (index !== -1) {
          state.workers[index] = action.payload; // Update worker details
        }
        state.error = null;
      })
      .addCase(editWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete worker
      .addCase(deleteWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = state.workers.filter(
          (worker) => worker.id !== action.payload
        ); // Remove deleted worker from state
        state.error = null;
      })
      .addCase(deleteWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export the reducer
export const workerReducer = workerSlice.reducer;
