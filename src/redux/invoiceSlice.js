import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define the initial state for invoices
const initialState = {
  invoices: [],
  loading: false,
  error: null,
};

// Async thunk to get invoices
export const getInvoices = createAsyncThunk(
  "invoices/getInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/invoices");
      return response.data.data; // Assuming the API returns an array of invoices
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to fetch invoices"
      );
    }
  }
);

// Async thunk to add an invoice
export const addInvoice = createAsyncThunk(
  "invoices/addInvoice",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/invoices", formData);

      // Check if response status is 200 and has data

      return response.data; // Return the data containing the invoice details
    } catch (error) {
      console.error("API Error:", error); // Log the full error object
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Async thunk to update an invoice
export const updateInvoice = createAsyncThunk(
  "invoices/updateInvoice",
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/invoices/${id}/`, invoiceData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to update invoice"
      );
    }
  }
);

// Async thunk to delete an invoice
export const deleteInvoice = createAsyncThunk(
  "invoices/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/invoices/${id}/`);
      return id;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to delete invoice"
      );
    }
  }
);

// Create the invoice slice
const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getInvoices
      .addCase(getInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload; // Set the fetched invoices
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle addInvoice
      .addCase(addInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateInvoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(
          (invoice) => invoice.id === action.payload.id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteInvoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (invoice) => invoice.id !== action.payload
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const invoiceReducer = invoiceSlice.reducer;
export const invoiceActions = {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
};
