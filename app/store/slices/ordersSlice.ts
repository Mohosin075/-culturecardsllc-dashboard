import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export interface OrderItem {
  id: string;
  buyer: string;
  seller: string;
  item: string;
  totalPrice: string;
  status: string;
  deliveryDate: string;
}

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  return await api.dashboard.getOrders();
});

export const refundOrder = createAsyncThunk("orders/refundOrder", async (id: string) => {
  return id;
});

interface OrdersState {
  items: OrderItem[];
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
        state.items = (action.payload || []).map((o: any) => ({
          id: o.id || o.orderId || "",
          buyer: o.buyer || "Buyer",
          seller: o.seller || "Seller",
          item: o.item || "Collector Item",
          totalPrice: typeof o.totalPrice === "number" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(o.totalPrice) : (o.totalPrice || o.price || ""),
          status: o.status || "Pending",
          deliveryDate: o.deliveryDate || "",
        }));
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
