import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export interface Trade {
  id: string;
  sender: string;
  receiver: string;
  senderProduct: string;
  receiverProduct: string;
  supplement: string;
  status: string;
}

export const fetchTrades = createAsyncThunk("trades/fetchTrades", async () => {
  return await api.dashboard.getTrades();
});

export const declineTrade = createAsyncThunk("trades/declineTrade", async (id: string) => {
  await api.trades.decline(id);
  return id;
});

interface TradesState {
  items: Trade[];
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
        state.items = (action.payload || []).map((trade: any) => {
          let senderProduct = trade.senderProduct || "";
          let receiverProduct = trade.receiverProduct || "";
          if (trade.offeredItems && (!senderProduct || !receiverProduct)) {
            const parts = trade.offeredItems.split("↔");
            senderProduct = parts[0]?.trim() || "Item A";
            receiverProduct = parts[1]?.trim() || "Item B";
          }
          return {
            id: trade.id || trade._id || trade.tradeId || "",
            sender: trade.sender || trade.userA || trade.senderName || "User A",
            receiver: trade.receiver || trade.userB || trade.receiverName || "User B",
            senderProduct,
            receiverProduct,
            supplement: trade.supplement || (trade.cashTopUp ? `$${trade.cashTopUp}` : "$0"),
            status: trade.status || "Pending",
          };
        });
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load trades";
      })
      .addCase(declineTrade.fulfilled, (state, action) => {
        state.items = state.items.filter((trade) => trade.id !== action.payload);
      })
      .addCase(declineTrade.rejected, (state, action) => {
        state.error = action.error.message || "Failed to decline trade";
      });
  },
});

export default tradesSlice.reducer;
