import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define the initial state for payments
const initialState = {
  payments: [],
  loading: false,
  error: null,
};

// Async thunk to get payments
export const getPayments = createAsyncThunk(
  "payments/getPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/payments");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to fetch payments");
    }
  }
);

// Async thunk to add a payment
export const addPayment = createAsyncThunk(
  "payments/addPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await api.post("/payments", paymentData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add payment");
    }
  }
);

// Async thunk to update a payment
export const updatePayment = createAsyncThunk(
  "payments/updatePayment",
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/payments/${id}/`, paymentData); // Use PUT instead of POST
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update payment"
      );
    }
  }
);

// Async thunk to update payment status
export const updatePaymentStatus = createAsyncThunk(
  "payments/updatePaymentStatus",
  async ({ id, status, rejected_reason }, { rejectWithValue }) => {
    try {
      // Create the payload dynamically
      const payload = { id, status };
      if (status === "Rejected") {
        payload.rejected_reason = rejected_reason;
      }

      const response = await api.post(`/payments/confirm`, payload); // Send the payload to the API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

// Create the payment slice
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
        state.error = null;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || []; // Use action.payload for better error info
      })
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.payments)) {
          state.payments.push(action.payload); // Ensure state.payments is an array
        } else {
          console.error("State payments is not an array:", state.payments);
        }
        state.error = null; // Clear error on success
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use action.payload for better error info
      })
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(
          (payment) => payment.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index] = action.payload; // Update the payment details
        }
        state.error = null; // Clear error on success
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use action.payload for better error info
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(
          (payment) => payment.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index].status = action.payload.status; // Update the status
        }
        state.error = null; // Clear error on success
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use action.payload for better error info
      });
  },
});

// Export the reducer and actions
export const paymentReducer = paymentSlice.reducer;
export const paymentActions = {
  getPayments,
  addPayment,
  updatePayment,
  updatePaymentStatus,
};
