import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Async Thunks for API calls
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-bookings");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch bookings"
      );
    }
  }
);

export const addBooking = createAsyncThunk(
  "bookings/addBooking",
  async (newBooking, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-bookings", newBooking);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add booking");
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      await api.delete(`/hall-bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete booking"
      );
    }
  }
);

export const editBooking = createAsyncThunk(
  "bookings/editBooking",
  async (updatedBooking, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/hall-bookings/${updatedBooking.id}`,
        updatedBooking
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to edit booking");
    }
  }
);

export const approveBooking = createAsyncThunk(
  "bookings/approveBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hall-bookings/approve/${bookingId}`);
      return response.data; // Assuming success response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to approve booking"
      );
    }
  }
);

export const declineBooking = createAsyncThunk(
  "bookings/declineBooking",
  async ({ bookingId, rejected_reason }, { rejectWithValue }) => {
    try {
      // Sending both bookingId and reason in the request body
      const response = await api.post(`/hall-bookings/decline/${bookingId}`, {
        rejected_reason, // Include the reason here
      });
      return response.data; // Assuming success response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to decline booking"
      );
    }
  }
);

export const cancelMyBooking = createAsyncThunk(
  "bookings/cancelMyBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/hall-bookings/cancel-booking/${bookingId}`
      );
      return response.data; // Assuming success response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to cancel booking"
      );
    }
  }
);

// Initial state
const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

// Booking slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null; // Clear errors
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.error = null; // Clear errors
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
        state.error = null; // Clear errors
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(editBooking.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(editBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.error = null; // Clear errors
      })
      .addCase(editBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(approveBooking.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload; // Update the booking status
        }
        state.error = null; // Clear errors
      })
      .addCase(approveBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(declineBooking.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(declineBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload; // Update the booking status
        }
        state.error = null; // Clear errors
      })
      .addCase(declineBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(cancelMyBooking.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(cancelMyBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload; // Update booking status to canceled
        }
        state.error = null; // Clear errors
      })
      .addCase(cancelMyBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const bookingActions = {
  fetchBookings,
  addBooking,
  deleteBooking,
  editBooking,
  approveBooking,
  declineBooking,
  cancelMyBooking,
};

export default bookingSlice.reducer;
