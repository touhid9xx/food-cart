import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  OrderSummary,
  OrderSummaryState,
  OrderSearchCriteria,
  UpdateOrderStatusPayload,
} from "../../types";
import { orderSummaryApi } from "../api/orderSummaryApi";

// Initial state for order summary
const initialState: OrderSummaryState = {
  orders: [],
  filteredOrders: [],
  loading: false,
  error: null,
  searchTerm: "",
  dateFilter: {
    startDate: null,
    endDate: null,
  },
  statusFilter: null,
};

// Async thunks for order summary operations
export const fetchOrders = createAsyncThunk(
  "orderSummary/fetchOrders",
  async (criteria?: OrderSearchCriteria) => {
    const response = await orderSummaryApi.getOrders(criteria);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch orders");
    }
    return response.data;
  }
);

export const searchOrders = createAsyncThunk(
  "orderSummary/searchOrders",
  async (criteria: OrderSearchCriteria) => {
    const response = await orderSummaryApi.searchOrders(criteria);
    if (!response.success) {
      throw new Error(response.message || "Failed to search orders");
    }
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orderSummary/updateOrderStatus",
  async (payload: UpdateOrderStatusPayload) => {
    const response = await orderSummaryApi.updateOrderStatus(
      payload.orderId,
      payload.status
    );
    if (!response.success) {
      throw new Error(response.message || "Failed to update order status");
    }
    return response.data;
  }
);

export const fetchOrdersByDate = createAsyncThunk(
  "orderSummary/fetchOrdersByDate",
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    const response = await orderSummaryApi.getOrdersByDate(startDate, endDate);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch orders by date");
    }
    return response.data;
  }
);

export const fetchTodaysOrders = createAsyncThunk(
  "orderSummary/fetchTodaysOrders",
  async () => {
    const response = await orderSummaryApi.getTodaysOrders();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch today's orders");
    }
    return response.data;
  }
);

// Order summary slice
const orderSummarySlice = createSlice({
  name: "orderSummary",
  initialState,
  reducers: {
    // Set search term for local filtering
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    // Set date filter
    setDateFilter: (
      state,
      action: PayloadAction<{
        startDate: string | null;
        endDate: string | null;
      }>
    ) => {
      state.dateFilter = action.payload;
    },

    // Set status filter
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.statusFilter = action.payload;
    },

    // Clear all filters
    clearFilters: (state) => {
      state.searchTerm = "";
      state.dateFilter = { startDate: null, endDate: null };
      state.statusFilter = null;
      state.filteredOrders = state.orders;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Manual local filtering (for real-time search)
    applyLocalFilters: (state) => {
      let filtered = [...state.orders];

      // Apply search term filter
      if (state.searchTerm) {
        const searchTerm = state.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerEmail.toLowerCase().includes(searchTerm)
        );
      }

      // Apply status filter
      if (state.statusFilter) {
        filtered = filtered.filter(
          (order) => order.status === state.statusFilter
        );
      }

      // Apply date filter
      if (state.dateFilter.startDate && state.dateFilter.endDate) {
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.orderDate);
          const startDate = new Date(state.dateFilter.startDate!);
          const endDate = new Date(state.dateFilter.endDate!);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      state.filteredOrders = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders cases
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.filteredOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })

      // Search orders cases
      .addCase(searchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredOrders = action.payload;
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search orders";
      })

      // Update order status cases
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        // Update the order in both orders and filteredOrders arrays
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        state.filteredOrders = state.filteredOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update order status";
      })

      // Fetch orders by date cases
      .addCase(fetchOrdersByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredOrders = action.payload;
      })
      .addCase(fetchOrdersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders by date";
      })

      // Fetch today's orders cases
      .addCase(fetchTodaysOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodaysOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredOrders = action.payload;
      })
      .addCase(fetchTodaysOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch today's orders";
      });
  },
});

export const {
  setSearchTerm,
  setDateFilter,
  setStatusFilter,
  clearFilters,
  clearError,
  applyLocalFilters,
} = orderSummarySlice.actions;

export default orderSummarySlice.reducer;
