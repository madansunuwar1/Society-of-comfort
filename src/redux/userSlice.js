import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk to fetch residences
export const fetchResidences = createAsyncThunk(
  "user/fetchResidences",
  async () => {
    const response = await api.post("notices/userlist");
    return response.data;
  }
);

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await api.get("/users"); // Assuming API endpoint for fetching users
  return response.data.users;
});

// Async thunk to add a new user
export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add user");
    }
  }
);

// Async thunk to edit user details
export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${userId}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to edit user");
    }
  }
);

// Async thunk to delete a user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${userId}`); // Assuming API endpoint for deleting user
      return userId; // Return userId to remove from the state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchResidences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResidences.fulfilled, (state, action) => {
        state.loading = false;
        state.residences = action.payload;
      })
      .addCase(fetchResidences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Add new user to state
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Edit user
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload; // Update the user details
        }
        state.error = null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload); // Remove the deleted user from state
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export the reducer
export const userReducer = userSlice.reducer;
