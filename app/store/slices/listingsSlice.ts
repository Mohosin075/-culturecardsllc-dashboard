import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchListings = createAsyncThunk("listings/fetchListings", async () => {
  return await api.dashboard.getListings();
});

export const deleteListing = createAsyncThunk("listings/deleteListing", async (id: string) => {
  await api.products.delete(id);
  return id;
});

interface ListingsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  items: [],
  loading: false,
  error: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load listings";
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default listingsSlice.reducer;
