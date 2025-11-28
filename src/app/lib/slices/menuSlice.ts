import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MenuItem, MenuResponse } from "../../types";
import { menuApi } from "../api/menuApi"; 

interface MenuState {
  items: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,
  searchQuery: "",
};

// Async thunks - now using the API service
export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (): Promise<MenuResponse> => {
    return await menuApi.fetchMenu();
  }
);

export const fetchMenuByCategory = createAsyncThunk(
  "menu/fetchMenuByCategory",
  async (category: string): Promise<MenuItem[]> => {
    return await menuApi.fetchMenuByCategory(category);
  }
);

// New thunk for searching
export const searchMenuItems = createAsyncThunk(
  "menu/searchMenuItems",
  async (query: string): Promise<MenuItem[]> => {
    return await menuApi.searchMenuItems(query);
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.selectedCategory = null;
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch menu
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.categories = action.payload.categories;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch menu";
      })
      // Fetch by category
      .addCase(fetchMenuByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch menu by category";
      })
      // Search menu items
      .addCase(searchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search menu items";
      });
  },
});

export const { setSelectedCategory, setSearchQuery, clearError, clearFilters } =
  menuSlice.actions;
export default menuSlice.reducer;
