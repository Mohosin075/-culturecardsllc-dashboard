import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchOverview = createAsyncThunk("overview/fetchOverview", async () => {
  return await api.dashboard.getOverview();
});

interface OverviewState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: OverviewState = {
  data: null,
  loading: false,
  error: null,
};

const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load overview data";
      });
  },
});

export default overviewSlice.reducer;
