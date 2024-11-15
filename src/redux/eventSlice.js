import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Initial state for events
const initialState = {
  events: [],
  loading: false,
  error: null,
};

// Async thunk to get events
export const getEvents = createAsyncThunk(
  "events/getEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/events");
      return response.data.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to fetch events");
    }
  }
);

// Async thunk to add an event
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/events", eventData);
      return response.data.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Async thunk to update an event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      console.log("Payload Sent to API:", { ...eventData, _method: "PUT" });
      const response = await api.post(`/events/${id}`, {
        ...eventData,
        _method: "PUT",
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to update event");
    }
  }
);

// Async thunk to delete an event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id; // Return the ID of the deleted event to remove from state
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to delete event");
    }
  }
);

// Create the event slice
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getEvents
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload; // Set the fetched events
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle addEvent
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload); // Add the new event to the array
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateEvent
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(
          (event) => event.id === action.payload.id
        );
        if (index !== -1) {
          state.events[index] = action.payload; // Update the event in the array
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteEvent
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export const eventReducer = eventSlice.reducer;
export const eventActions = {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
};
