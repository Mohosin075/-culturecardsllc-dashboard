import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchPayments = createAsyncThunk("payments/fetchPayments", async () => {
  return await api.dashboard.getPayments();
});

interface PaymentsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  items: [],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load payments";
      });
  },
});

export default paymentsSlice.reducer;
