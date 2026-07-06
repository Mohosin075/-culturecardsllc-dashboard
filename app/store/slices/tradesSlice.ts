import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchTrades = createAsyncThunk("trades/fetchTrades", async () => {
  return await api.dashboard.getTrades();
});

export const declineTrade = createAsyncThunk("trades/declineTrade", async (id: string) => {
  return id;
});

interface TradesState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TradesState = {
  items: [],
  loading: false,
  error: null,
};

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load trades";
      })
      .addCase(declineTrade.fulfilled, (state, action) => {
        state.items = state.items.filter((trade) => trade.id !== action.payload);
      });
  },
});

export default tradesSlice.reducer;
