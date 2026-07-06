import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  return await api.dashboard.getOrders();
});

export const refundOrder = createAsyncThunk("orders/refundOrder", async (id: string) => {
  return id;
});

interface OrdersState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load orders";
      })
      .addCase(refundOrder.fulfilled, (state, action) => {
        state.items = state.items.map((order) =>
          order.id === action.payload ? { ...order, status: "Refunded" } : order
        );
      });
  },
});

export default ordersSlice.reducer;
