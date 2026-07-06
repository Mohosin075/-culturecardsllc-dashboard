import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchBoostedListings = createAsyncThunk(
  "boostedListings/fetchBoostedListings",
  async () => {
    return await api.dashboard.getBoostedListings();
  }
);

interface BoostedListingsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BoostedListingsState = {
  items: [],
  loading: false,
  error: null,
};

const boostedListingsSlice = createSlice({
  name: "boostedListings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoostedListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoostedListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchBoostedListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load boosted listings";
      });
  },
});

export default boostedListingsSlice.reducer;
