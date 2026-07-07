import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export interface SellerVerificationRequest {
  id: string;
  name: string;
  email: string;
  status: string;
  category: string;
  submitted: string;
  documents: string[];
}

export const fetchSellerVerifications = createAsyncThunk(
  "sellerVerification/fetchSellerVerifications",
  async () => {
    return await api.dashboard.getSellerVerifications();
  }
);

export const approveVerification = createAsyncThunk(
  "sellerVerification/approveVerification",
  async (id: string) => {
    await api.users.update(id, { verified: true });
    return id;
  }
);

export const rejectVerification = createAsyncThunk(
  "sellerVerification/rejectVerification",
  async (id: string) => {
    await api.users.update(id, { verified: false });
    return id;
  }
);

interface SellerVerificationState {
  items: SellerVerificationRequest[];
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
        state.items = (action.payload || []).map((req: any) => ({
          id: req.id || req.requestId || "",
          name: req.name || "",
          email: req.email || "",
          status: req.status || "Pending",
          category: req.category || "",
          submitted: req.submitted || "",
          documents: req.documents || req.submittedDocuments || [],
        }));
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
