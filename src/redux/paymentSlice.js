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
  async () => {
    const response = await api.get("/payments");
    return response.data;
  }
);

// Async thunk to add a payment
export const addPayment = createAsyncThunk(
  "payments/addPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      // Add specific headers for FormData
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await api.post("/payments", paymentData, config);
      return response.data;
    } catch (error) {
      // Improved error handling
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to add payment");
    }
  }
);

// Async thunk to update a payment
export const updatePayment = createAsyncThunk(
  "payments/updatePayment",
  async ({ id, paymentData }) => {
    const response = await api.post(`/payments/${id}/`, paymentData);
    return response.data;
  }
);

// Async thunk to update payment status
export const updatePaymentStatus = createAsyncThunk(
  "payments/updatePaymentStatus",
  async ({ id, status }) => {
    const response = await api.post(`/payments/confirm`, { id, status });
    return response.data;
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
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(
          (payment) => payment.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(
          (payment) => payment.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index].status = action.payload.status;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const paymentReducer = paymentSlice.reducer;
export const paymentActions = {
  getPayments,
  addPayment,
  updatePayment,
  updatePaymentStatus,
};
