import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchSellerVerifications = createAsyncThunk(
  "sellerVerification/fetchSellerVerifications",
  async () => {
    return await api.dashboard.getSellerVerifications();
  }
);

export const approveVerification = createAsyncThunk(
  "sellerVerification/approveVerification",
  async (id: string) => {
    // For live backend, this can hit a verifications endpoint, but for now we filter it out
    return id;
  }
);

export const rejectVerification = createAsyncThunk(
  "sellerVerification/rejectVerification",
  async (id: string) => {
    return id;
  }
);

interface SellerVerificationState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SellerVerificationState = {
  items: [],
  loading: false,
  error: null,
};

const sellerVerificationSlice = createSlice({
  name: "sellerVerification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSellerVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load verification requests";
      })
      .addCase(approveVerification.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      .addCase(rejectVerification.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default sellerVerificationSlice.reducer;
