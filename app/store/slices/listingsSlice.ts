import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export interface Listing {
  id: string;
  seller: string;
  item: string;
  price: string;
  category: string;
  views: number;
  status: string;
  boosted: boolean;
}

export const fetchListings = createAsyncThunk("listings/fetchListings", async () => {
  return await api.dashboard.getListings();
});

export const deleteListing = createAsyncThunk("listings/deleteListing", async (id: string) => {
  await api.products.delete(id);
  return id;
});

export const toggleBoostListing = createAsyncThunk(
  "listings/toggleBoostListing",
  async ({ id, boosted }: { id: string; boosted: boolean }) => {
    await api.products.update(id, { isFeatured: !boosted });
    return { id, boosted: !boosted };
  }
);

interface ListingsState {
  items: Listing[];
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
        state.items = (action.payload || []).map((item: any) => ({
          id: item.id || item.listingId || "",
          seller: item.seller || "Seller",
          item: item.item || item.itemName || "Collector Item",
          price: typeof item.price === "number" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.price) : (item.price || ""),
          category: item.category || "",
          views: item.views !== undefined ? item.views : 0,
          status: item.status || "Live",
          boosted: item.boosted !== undefined ? item.boosted : (item.isBoosted || false),
        }));
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load listings";
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(toggleBoostListing.fulfilled, (state, action) => {
        const { id, boosted } = action.payload;
        state.items = state.items.map((item) =>
          item.id === id ? { ...item, boosted } : item
        );
      });
  },
});

export default listingsSlice.reducer;
