import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    return await api.dashboard.getNotifications();
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async () => {
    await api.dashboard.markNotificationsRead();
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id: string | number) => {
    return id;
  }
);

interface NotificationsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load notifications";
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = state.items.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        );
      });
  },
});

export default notificationsSlice.reducer;
