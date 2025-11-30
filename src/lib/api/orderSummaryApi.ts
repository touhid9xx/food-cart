/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderSummary, OrderSearchCriteria, ApiResponse } from "../../types";
import { CrudService, ApiResponseBuilder } from "../utils/apiUtils";
import { fakeOrders } from "../data";

// Create CRUD service instance using your existing CrudService
const orderCrud = new CrudService<OrderSummary>(fakeOrders);

// Helper function to find order by ID with proper typing
const findOrderById = (orderId: string): OrderSummary | undefined => {
  return fakeOrders.find((order) => order.id === orderId);
};

export const orderSummaryApi = {
  /**
   * Fetch all orders with optional filtering criteria
   * Uses the existing CrudService for base operations
   */
  getOrders: async (
    criteria?: OrderSearchCriteria
  ): Promise<ApiResponse<OrderSummary[]>> => {
    // Use CrudService's getAll as base
    const baseResponse = await orderCrud.getAll(
      "Orders retrieved successfully"
    );

    if (!baseResponse.success) {
      return baseResponse;
    }

    let filteredOrders = baseResponse.data;

    // Apply additional filtering based on criteria
    if (criteria) {
      if (criteria.searchTerm) {
        const searchTerm = criteria.searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerEmail.toLowerCase().includes(searchTerm)
        );
      }

      if (criteria.customerName) {
        filteredOrders = filteredOrders.filter((order) =>
          order.customerName
            .toLowerCase()
            .includes(criteria.customerName!.toLowerCase())
        );
      }

      if (criteria.orderId) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.id === criteria.orderId ||
            order.orderNumber === criteria.orderId
        );
      }

      if (criteria.status) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === criteria.status
        );
      }

      if (criteria.startDate && criteria.endDate) {
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          const startDate = new Date(criteria.startDate!);
          const endDate = new Date(criteria.endDate!);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }
    }

    return ApiResponseBuilder.success(
      filteredOrders,
      "Orders filtered successfully"
    );
  },

  /**
   * Search orders by multiple criteria
   * Reuses getOrders with criteria
   */
  searchOrders: async (
    criteria: OrderSearchCriteria
  ): Promise<ApiResponse<OrderSummary[]>> => {
    return orderSummaryApi.getOrders(criteria);
  },

  /**
   * Get orders by date range
   */
  getOrdersByDate: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<OrderSummary[]>> => {
    return orderSummaryApi.getOrders({ startDate, endDate });
  },

  /**
   * Update order status (for admin manual confirmation)
   * Uses direct array manipulation to avoid type issues with CrudService
   */
  updateOrderStatus: async (
    orderId: string,
    status: OrderSummary["status"]
  ): Promise<ApiResponse<OrderSummary>> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Find the order directly from the array
    const orderIndex = fakeOrders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
      return ApiResponseBuilder.error("Order not found", {} as OrderSummary);
    }

    const currentOrder = fakeOrders[orderIndex];

    // Prepare update data
    const updateData: Partial<OrderSummary> = { status };

    // Additional logic for status changes
    if (
      status === "delivered" &&
      currentOrder.paymentMethod === "cash" &&
      currentOrder.paymentStatus === "pending"
    ) {
      updateData.paymentStatus = "paid";
    }

    if (status === "cancelled" && currentOrder.paymentStatus === "paid") {
      updateData.paymentStatus = "refunded";
    }

    // Update the order directly
    const updatedOrder = { ...currentOrder, ...updateData };
    fakeOrders[orderIndex] = updatedOrder;

    return ApiResponseBuilder.success(
      updatedOrder,
      `Order status updated to ${status}`
    );
  },

  /**
   * Get order by ID - fixed version without CrudService type issues
   */
  getOrderById: async (orderId: string): Promise<ApiResponse<OrderSummary>> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

    const order = findOrderById(orderId);

    if (!order) {
      return ApiResponseBuilder.error("Order not found", {} as OrderSummary);
    }

    return ApiResponseBuilder.success(order, "Order retrieved successfully");
  },

  /**
   * Get today's orders
   */
  getTodaysOrders: async (): Promise<ApiResponse<OrderSummary[]>> => {
    const today = new Date().toISOString().split("T")[0];
    const baseResponse = await orderCrud.getAll();

    if (!baseResponse.success) {
      return baseResponse;
    }

    const todayOrders = baseResponse.data.filter((order) =>
      order.orderDate.startsWith(today)
    );

    return ApiResponseBuilder.success(todayOrders, "Today's orders retrieved");
  },

  /**
   * Get orders by status using CrudService search
   */
  getOrdersByStatus: async (
    status: OrderSummary["status"]
  ): Promise<ApiResponse<OrderSummary[]>> => {
    return orderCrud.search(
      { status },
      `Orders with status ${status} retrieved`
    );
  },

  /**
   * Get paginated orders using CrudService paginate
   */
  getPaginatedOrders: async (
    page: number = 1,
    limit: number = 10,
    sort?: { field: string; direction: "asc" | "desc" }
  ) => {
    return orderCrud.paginate(page, limit, sort, "Paginated orders retrieved");
  },

  /**
   * Check if order exists - fixed version
   */
  orderExists: async (orderId: string): Promise<ApiResponse<boolean>> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const exists = fakeOrders.some((order) => order.id === orderId);
    return ApiResponseBuilder.success(
      exists,
      exists ? "Order exists" : "Order does not exist"
    );
  },

  /**
   * Get orders count using CrudService
   */
  getOrdersCount: async (): Promise<ApiResponse<number>> => {
    return orderCrud.count("Orders count retrieved");
  },
};
