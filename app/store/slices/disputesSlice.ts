import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchDisputes = createAsyncThunk("disputes/fetchDisputes", async () => {
  return await api.dashboard.getDisputes();
});

export const resolveDispute = createAsyncThunk(
  "disputes/resolveDispute",
  async (id: string) => {
    await api.support.updateStatus(id, "resolved", "Resolved by Admin intervention.");
    return id;
  }
);

export const rejectDispute = createAsyncThunk(
  "disputes/rejectDispute",
  async (id: string) => {
    await api.support.updateStatus(id, "rejected", "Rejected by Admin intervention.");
    return id;
  }
);

interface DisputesState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DisputesState = {
  items: [],
  loading: false,
  error: null,
};

const disputesSlice = createSlice({
  name: "disputes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load disputes";
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.items = state.items.map((dispute) =>
          dispute.id === action.payload ? { ...dispute, status: "Resolved" } : dispute
        );
      })
      .addCase(rejectDispute.fulfilled, (state, action) => {
        state.items = state.items.map((dispute) =>
          dispute.id === action.payload ? { ...dispute, status: "Rejected" } : dispute
        );
      });
  },
});

export default disputesSlice.reducer;
