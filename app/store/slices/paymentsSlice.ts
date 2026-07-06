import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchPayments = createAsyncThunk("payments/fetchPayments", async () => {
  return await api.dashboard.getPayments();
});

export interface Transaction {
  id: string;
  user: string;
  type: string;
  amount: string | number;
  gateway?: string;
  date: string;
  status: string;
}

export interface PaymentsSummary {
  totalRevenue: number | string;
  commissionEarned: number | string;
  pendingPayouts: number | string;
  completedPayouts: number | string;
}

interface PaymentsState {
  items: Transaction[];
  summary: PaymentsSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  items: [],
  summary: null,
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
        
        let rawTransactions: any[] = [];
        let rawSummary: any = null;

        const payload = action.payload as any;
        if (Array.isArray(payload)) {
          // Frontend fallback mockup data
          rawTransactions = payload;
        } else if (payload && typeof payload === "object") {
          // Real backend response
          rawTransactions = payload.recentTransactions || [];
          rawSummary = payload.summary;
        }

        // Normalize transactions to ensure they always have a populated 'id'
        state.items = rawTransactions.map((tx: any) => ({
          ...tx,
          id: tx.id || tx.transactionId || "",
        }));

        if (rawSummary) {
          state.summary = {
            totalRevenue: rawSummary.totalRevenue,
            commissionEarned: rawSummary.commissionEarned,
            pendingPayouts: rawSummary.pendingPayouts,
            completedPayouts: rawSummary.completedPayouts,
          };
        }
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load payments";
      });
  },
});

export default paymentsSlice.reducer;
