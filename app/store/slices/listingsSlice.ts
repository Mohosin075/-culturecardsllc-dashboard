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
  return await api.products.getAll();
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
        state.items = (action.payload || []).map((item: any, idx: number) => {
          const sellerName = item.sellerId?.fullName || item.sellerId?.name || (typeof item.seller === 'object' ? item.seller?.name || item.seller?.fullName : item.seller) || "Seller";
          const rawPrice = item.buyNowPrice || item.estValue || item.startingBid || item.price || 0;
          const formattedPrice = typeof rawPrice === "number"
            ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rawPrice)
            : String(rawPrice);
          const displayStatus = item.status === "active" || item.status === "pending" || item.status === "Live"
            ? "Live"
            : (item.status === "sold" || item.status === "Sold" ? "Sold" : "Removed");

          return {
            id: item._id || item.id || item.listingId || "",
            seller: sellerName,
            item: item.title || item.itemName || "Collector Item",
            price: formattedPrice,
            category: typeof item.category === 'object' ? (item.category?.name || item.category?.title || "") : (item.category || ""),
            views: item.views !== undefined ? item.views : 0,
            status: displayStatus,
            boosted: item.isFeatured !== undefined ? item.isFeatured : (item.boosted || false),
          };
        });
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
