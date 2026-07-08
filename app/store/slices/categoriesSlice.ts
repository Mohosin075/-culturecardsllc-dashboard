import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await api.categories.getAll();
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async ({ name, description }: { name: string; description: string }) => {
    const newCat = await api.categories.create(name, description);
    return newCat;
  }
);

export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ id, description }: { id: string; description: string }) => {
    await api.categories.update(id, { description });
    return { id, description };
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string) => {
    await api.categories.delete(id);
    return id;
  }
);

export interface Category {
  id: string;
  name: string;
  count: number;
  iconName: string;
  subcategories: string[];
  description?: string;
}

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = Array.isArray(action.payload)
          ? action.payload
          : (action.payload as any)?.data || [];
        state.items = payloadData.map((cat: any, idx: number) => ({
          ...cat,
          id: cat._id || cat.id || cat.categoryId || `CAT-${(idx + 1).toString().padStart(3, '0')}`,
          count: cat.count !== undefined ? cat.count : (cat.listingsCount || 0),
          iconName: cat.iconName || (cat.name === "Sneakers" ? "Footprints" : (cat.name === "Trading Cards" || cat.name === "Cards" ? "Cards" : (cat.name === "Watches" ? "Watch" : (cat.name === "Tech" ? "Laptop" : "Cards")))),
          subcategories: cat.subcategories || [],
          description: cat.description || "",
        }));
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load categories";
      })
      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        const newCat = action.payload;
        state.items.push({
          id: newCat.id || `CAT-00${state.items.length + 1}`,
          name: newCat.name,
          count: 0,
          iconName: "Cards",
          subcategories: [],
          description: newCat.description || "",
        });
      })
      // Edit Category
      .addCase(editCategory.fulfilled, (state, action) => {
        const { id, description } = action.payload;
        state.items = state.items.map((cat) =>
          cat.id === id ? { ...cat, description } : cat
        );
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((cat) => cat.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
