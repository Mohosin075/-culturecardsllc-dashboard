import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await api.dashboard.getUsers();
});

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ userId, status }: { userId: string; status: string }) => {
    await api.users.updateStatus(userId, status);
    return { userId, status };
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId: string) => {
  await api.users.delete(userId);
  return userId;
});

interface UsersState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users";
      })
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.items = state.items.map((user) =>
          user.id === userId ? { ...user, status } : user
        );
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        state.items = state.items.filter((user) => user.id !== userId);
      });
  },
});

export default usersSlice.reducer;
