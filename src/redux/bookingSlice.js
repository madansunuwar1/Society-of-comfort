import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Async Thunks for API calls
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => {
    const response = await api.get("/hall-bookings");
    return response.data;
  }
);

export const addBooking = createAsyncThunk(
  "bookings/addBooking",
  async (newBooking) => {
    const response = await api.post("/hall-bookings", newBooking);
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (bookingId) => {
    await api.delete(`/hall-bookings/${bookingId}`);
    return bookingId;
  }
);

export const editBooking = createAsyncThunk(
  "bookings/editBooking",
  async (updatedBooking) => {
    const response = await api.put(
      `/hall-bookings/${updatedBooking.id}`,
      updatedBooking
    );
    return response.data;
  }
);

export const approveBooking = createAsyncThunk(
  "bookings/approveBooking",
  async (bookingId) => {
    const response = await api.post(`/hall-bookings/approve/${bookingId}`);
    return response.data; // Adjust as necessary based on your API response
  }
);

export const declineBooking = createAsyncThunk(
  "bookings/declineBooking",
  async (bookingId) => {
    const response = await api.post(`/hall-bookings/decline/${bookingId}`);
    return response.data; // Adjust as necessary based on your API response
  }
);

export const cancelMyBooking = createAsyncThunk(
  "bookings/cancelMyBooking",
  async (bookingId) => {
    const response = await api.post(
      `/hall-bookings/cancel-booking/${bookingId}`
    );
    return response.data; // Adjust as necessary based on your API response
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
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      })
      .addCase(editBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload; // Update the booking status
        }
      })
      .addCase(declineBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload; // Update the booking status
        }
      })
      .addCase(cancelMyBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload; // Update booking status to canceled
        }
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
