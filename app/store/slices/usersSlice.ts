import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export interface User {
  userId: string;
  name: string;
  username: string;
  email: string;
  role: string;
  rating: number;
  transactions: number;
  status: "Active" | "Suspended";
  color?: string;
}

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
  items: User[];
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = (action.payload || []).map((user: any) => ({
          ...user,
          userId: user.userId || user._id || user.id,
        }));
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users";
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.items = state.items.map((user) =>
          user.userId === userId ? { ...user, status: status as "Active" | "Suspended" } : user
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update user status";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        state.items = state.items.filter((user) => user.userId !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export default usersSlice.reducer;
