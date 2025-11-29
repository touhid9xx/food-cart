/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderSummary, OrderSearchCriteria, ApiResponse } from "../../types";
import { CrudService, ApiResponseBuilder } from "../utils/apiUtils";

// Enhanced fake order data with realistic timestamps and various statuses
const fakeOrders: OrderSummary[] = [
  {
    id: "order_001",
    orderNumber: "ORD-2024-001234",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 (555) 123-4567",
    items: [
      { id: "item_1", name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { id: "item_2", name: "Garlic Bread", quantity: 2, price: 4.99 },
    ],
    total: 22.97,
    status: "delivered",
    orderDate: "2024-01-15T14:30:00Z",
    estimatedDelivery: "2024-01-15T15:15:00Z",
    deliveryAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    specialInstructions: "Leave at door, don't ring bell",
    dietaryRequirements: "Gluten-free crust required",
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
    },
    deliveryDriver: {
      id: "driver_1",
      name: "Mike Johnson",
      phone: "+1 (555) 987-6543",
    },
  },
  {
    id: "order_002",
    orderNumber: "ORD-2024-001235",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1 (555) 234-5678",
    items: [
      { id: "item_3", name: "Pepperoni Feast", quantity: 1, price: 15.99 },
      { id: "item_4", name: "Caesar Salad", quantity: 1, price: 8.99 },
      { id: "item_5", name: "Iced Coffee", quantity: 1, price: 4.99 },
    ],
    total: 29.97,
    status: "out_for_delivery",
    orderDate: "2024-01-15T18:45:00Z",
    estimatedDelivery: "2024-01-15T19:30:00Z",
    deliveryAddress: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002",
    },
    paymentMethod: "digital_wallet",
    paymentStatus: "paid",
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
    },
    deliveryDriver: {
      id: "driver_2",
      name: "Emily Chen",
      phone: "+1 (555) 876-5432",
    },
  },
  {
    id: "order_003",
    orderNumber: "ORD-2024-001236",
    customerName: "Mike Brown",
    customerEmail: "mike.brown@email.com",
    customerPhone: "+1 (555) 345-6789",
    items: [
      { id: "item_6", name: "Vegetarian Supreme", quantity: 1, price: 14.99 },
      { id: "item_7", name: "Chocolate Brownie", quantity: 2, price: 6.99 },
    ],
    total: 28.97,
    status: "preparing",
    orderDate: "2024-01-15T19:00:00Z",
    estimatedDelivery: "2024-01-15T19:45:00Z",
    deliveryAddress: {
      street: "789 Pine Street",
      city: "New York",
      state: "NY",
      zipCode: "10003",
    },
    paymentMethod: "cash",
    paymentStatus: "pending",
    specialInstructions: "Call upon arrival",
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
    },
  },
  {
    id: "order_004",
    orderNumber: "ORD-2024-001237",
    customerName: "Lisa Wang",
    customerEmail: "lisa.wang@email.com",
    customerPhone: "+1 (555) 456-7890",
    items: [
      { id: "item_8", name: "Spaghetti Carbonara", quantity: 1, price: 13.99 },
      { id: "item_9", name: "Greek Salad", quantity: 1, price: 9.99 },
    ],
    total: 23.98,
    status: "confirmed",
    orderDate: "2024-01-15T19:15:00Z",
    estimatedDelivery: "2024-01-15T20:00:00Z",
    deliveryAddress: {
      street: "321 Elm Street",
      city: "New York",
      state: "NY",
      zipCode: "10004",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    dietaryRequirements: "No dairy in salad",
    restaurant: {
      id: "rest_2",
      name: "Pasta Paradise",
    },
  },
  {
    id: "order_005",
    orderNumber: "ORD-2024-001238",
    customerName: "David Miller",
    customerEmail: "david.m@email.com",
    customerPhone: "+1 (555) 567-8901",
    items: [
      { id: "item_10", name: "Classic Beef Burger", quantity: 2, price: 10.99 },
      { id: "item_11", name: "Fresh Orange Juice", quantity: 2, price: 3.99 },
    ],
    total: 29.96,
    status: "pending",
    orderDate: "2024-01-15T19:30:00Z",
    estimatedDelivery: "2024-01-15T20:15:00Z",
    deliveryAddress: {
      street: "654 Maple Road",
      city: "New York",
      state: "NY",
      zipCode: "10005",
    },
    paymentMethod: "digital_wallet",
    paymentStatus: "pending",
    restaurant: {
      id: "rest_3",
      name: "Burger Barn",
    },
  },
  {
    id: "order_006",
    orderNumber: "ORD-2024-001239",
    customerName: "Maria Garcia",
    customerEmail: "maria.g@email.com",
    customerPhone: "+1 (555) 678-9012",
    items: [
      { id: "item_12", name: "Spicy Chicken Burger", quantity: 1, price: 9.99 },
      { id: "item_13", name: "Onion Rings", quantity: 1, price: 5.99 },
    ],
    total: 15.98,
    status: "ready",
    orderDate: "2024-01-15T19:45:00Z",
    estimatedDelivery: "2024-01-15T20:30:00Z",
    deliveryAddress: {
      street: "987 Cedar Lane",
      city: "New York",
      state: "NY",
      zipCode: "10006",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    restaurant: {
      id: "rest_3",
      name: "Burger Barn",
    },
  },
  {
    id: "order_007",
    orderNumber: "ORD-2024-001240",
    customerName: "Robert Wilson",
    customerEmail: "robert.w@email.com",
    customerPhone: "+1 (555) 789-0123",
    items: [
      {
        id: "item_14",
        name: "Mushroom Swiss Burger",
        quantity: 1,
        price: 11.99,
      },
      { id: "item_15", name: "Sweet Potato Fries", quantity: 1, price: 4.99 },
    ],
    total: 16.98,
    status: "cancelled",
    orderDate: "2024-01-15T20:00:00Z",
    estimatedDelivery: "2024-01-15T20:45:00Z",
    deliveryAddress: {
      street: "147 Birch Street",
      city: "New York",
      state: "NY",
      zipCode: "10007",
    },
    paymentMethod: "digital_wallet",
    paymentStatus: "refunded",
    restaurant: {
      id: "rest_3",
      name: "Burger Barn",
    },
  },
];

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
