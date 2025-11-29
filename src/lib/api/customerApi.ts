/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Customer,
  CustomerAddress,
  PaymentMethod,
  CustomerReview,
  OrderHistory,
  DeliveryInstruction,
  DietaryRestriction,
  CustomerPreferences,
} from "../../types";
import { CrudService, ApiResponseBuilder } from "../utils/apiUtils";

// Enhanced fake customer data
const fakeCustomers: Customer[] = [
  {
    id: "cust_1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/images/avatars/john.png",
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      dietary: ["gluten-free", "low-sodium"],
      favoriteCuisines: ["Italian", "Mexican", "Japanese"],
      spicePreference: "medium",
      deliveryInstructions:
        "Please ring doorbell twice and leave at the front door. No contact with pets please.",
      specialRequirements:
        "Please ensure all items are gluten-free. Avoid cross-contamination with seafood.",
      cutleryPreference: "do_not_include",
      contactlessDelivery: true,
    },
    addresses: [
      {
        id: "addr_1",
        type: "home",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        isDefault: true,
        instructions: "Apartment 4B, buzz code #1234",
        deliveryInstructions:
          "Leave package in the lobby if no answer. Do not leave outside in rain.",
        dietaryRestrictionsNote:
          "Severe gluten allergy in household. Please ensure no bread items.",
      },
    ],
    paymentMethods: [
      {
        id: "pay_1",
        type: "cash",
        isDefault: true,
      },
    ],
    reviews: [
      {
        id: "rev_1",
        menuItemId: "1",
        menuItemName: "Margherita Pizza",
        rating: 5,
        comment: "Absolutely delicious! The gluten-free crust was perfect!",
        createdAt: "2024-01-15T14:30:00Z",
        images: ["/images/reviews/pizza-1.jpg"],
        helpful: 12,
        dietaryComment: "Excellent gluten-free options",
      },
    ],
    dietaryRestrictions: ["Celiac Disease", "Gluten Intolerance"],
    loyaltyPoints: 1250,
    joinedDate: "2023-06-15T00:00:00Z",
    lastOrderDate: "2024-01-15T14:30:00Z",
  },
];

// Fake order history data
const fakeOrderHistory: OrderHistory[] = [
  {
    id: "order_1",
    orderNumber: "ORD-001234",
    items: [
      {
        id: "item_1",
        name: "Margherita Pizza",
        quantity: 1,
        price: 12.99,
        image: "/images/pizza/margherita-1.jpg",
        specialInstructions: "Extra cheese, well done",
        dietaryRequirements: "Gluten-free crust required",
      },
    ],
    total: 12.99,
    status: "completed",
    orderDate: "2024-01-15T14:30:00Z",
    deliveryAddress: fakeCustomers[0].addresses[0],
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
      image: "/images/restaurants/pizza-palace.jpg",
    },
    deliveryInstructions: "Leave at door, don't ring bell",
    specialRequirements: "Severe gluten allergy - no cross contamination",
    rating: 5,
    review: "Great service and food was delicious!",
    customerId: "cust_1",
  },
];

// Fake delivery instructions templates
const deliveryInstructions: DeliveryInstruction[] = [
  {
    id: "deliv_1",
    type: "leave_at_door",
    message: "Leave at my door. No need to knock or ring bell.",
    isDefault: true,
  },
  {
    id: "deliv_2",
    type: "hand_to_me",
    message: "Please hand it to me directly.",
    isDefault: false,
  },
];

// Fake dietary restrictions database
const dietaryRestrictions: DietaryRestriction[] = [
  {
    id: "diet_1",
    type: "allergy",
    name: "Peanut Allergy",
    severity: "severe",
    description: "Life-threatening allergy to peanuts and peanut products",
  },
  {
    id: "diet_2",
    type: "intolerance",
    name: "Lactose Intolerance",
    severity: "moderate",
    description: "Difficulty digesting lactose in dairy products",
  },
];

// Create CRUD services for each entity
const customerCrud = new CrudService<Customer>(fakeCustomers);
const addressCrud = new CrudService<CustomerAddress>([]);
const paymentCrud = new CrudService<PaymentMethod>([]);
const reviewCrud = new CrudService<CustomerReview>([]);
const orderHistoryCrud = new CrudService<OrderHistory>(fakeOrderHistory);
const deliveryInstructionsCrud = new CrudService<DeliveryInstruction>(
  deliveryInstructions
);
const dietaryRestrictionsCrud = new CrudService<DietaryRestriction>(
  dietaryRestrictions
);

// Initialize with data from customers
fakeCustomers.forEach((customer) => {
  customer.addresses.forEach((addr) => {
    addressCrud["repository"]["items"].push({
      ...addr,
      customerId: customer.id,
    });
  });
  customer.paymentMethods.forEach((pm) => {
    paymentCrud["repository"]["items"].push({ ...pm, customerId: customer.id });
  });
  customer.reviews.forEach((review) => {
    reviewCrud["repository"]["items"].push({
      ...review,
      customerId: customer.id,
    });
  });
});

export const customerApi = {
  // ========== CUSTOMER CRUD OPERATIONS ==========
  getCustomerProfile: (customerId: string) =>
    customerCrud.getById(customerId, "Customer profile loaded successfully"),

  updateCustomerProfile: (customerId: string, updates: Partial<Customer>) =>
    customerCrud.update(customerId, updates, "Profile updated successfully"),

  getAllCustomers: () =>
    customerCrud.getAll("All customers retrieved successfully"),

  deleteCustomer: (customerId: string) =>
    customerCrud.delete(customerId, "Customer deleted successfully"),

  searchCustomers: (criteria: any) =>
    customerCrud.search(criteria, "Customers search completed"),

  // ========== ADDRESS OPERATIONS ==========
  addAddress: async (
    customerId: string,
    address: Omit<CustomerAddress, "id">
  ) => {
    const newAddress = await addressCrud.create(
      { ...address, customerId } as any,
      "Address added successfully"
    );

    // Also update the customer's addresses
    const customer = await customerCrud.getById(customerId);
    if (customer.success && customer.data) {
      const updatedAddresses = [...customer.data.addresses, newAddress.data];
      await customerCrud.update(customerId, {
        addresses: updatedAddresses,
      } as any);
    }

    return newAddress;
  },

  updateAddress: (addressId: string, updates: Partial<CustomerAddress>) =>
    addressCrud.update(addressId, updates, "Address updated successfully"),

  deleteAddress: (addressId: string) =>
    addressCrud.delete(addressId, "Address deleted successfully"),

  getCustomerAddresses: (customerId: string) =>
    addressCrud.getByField(
      "customerId",
      customerId,
      "Customer addresses loaded successfully"
    ),

  // ========== PAYMENT METHOD OPERATIONS ==========
  addPaymentMethod: async (
    customerId: string,
    paymentMethod: Omit<PaymentMethod, "id">
  ) => {
    const newPayment = await paymentCrud.create(
      { ...paymentMethod, customerId } as any,
      "Payment method added successfully"
    );

    // Update customer's payment methods
    const customer = await customerCrud.getById(customerId);
    if (customer.success && customer.data) {
      const updatedPayments = [
        ...customer.data.paymentMethods,
        newPayment.data,
      ];
      await customerCrud.update(customerId, {
        paymentMethods: updatedPayments,
      } as any);
    }

    return newPayment;
  },

  getPaymentMethods: (customerId: string) =>
    paymentCrud.getByField(
      "customerId",
      customerId,
      "Payment methods loaded successfully"
    ),

  deletePaymentMethod: (paymentMethodId: string) =>
    paymentCrud.delete(paymentMethodId, "Payment method deleted successfully"),

  // ========== REVIEW OPERATIONS ==========
  addReview: (
    review: Omit<CustomerReview, "id" | "createdAt" | "helpful"> & {
      customerId: string;
    }
  ) =>
    reviewCrud.create(
      {
        ...review,
        createdAt: new Date().toISOString(),
        helpful: 0,
      } as any,
      "Review added successfully"
    ),

  getCustomerReviews: (customerId: string) =>
    reviewCrud.getByField(
      "customerId",
      customerId,
      "Customer reviews loaded successfully"
    ),

  // ========== ORDER HISTORY OPERATIONS ==========
  getOrderHistory: (customerId: string) =>
    orderHistoryCrud.getByField(
      "customerId",
      customerId,
      "Order history loaded successfully"
    ),

  // ========== DELIVERY & DIETARY OPERATIONS ==========
  getDeliveryInstructions: () =>
    deliveryInstructionsCrud.getAll("Delivery instructions loaded"),

  getDietaryRestrictions: () =>
    dietaryRestrictionsCrud.getAll("Dietary restrictions loaded"),

  setDefaultDeliveryInstructions: async (
    customerId: string,
    instructions: string
  ) => {
    return customerCrud.update(
      customerId,
      { preferences: { deliveryInstructions: instructions } as any },
      "Default delivery instructions updated successfully"
    );
  },

  setSpecialRequirements: async (customerId: string, requirements: string) => {
    return customerCrud.update(
      customerId,
      { preferences: { specialRequirements: requirements } as any },
      "Special requirements saved"
    );
  },

  updateDietaryPreferences: async (
    customerId: string,
    dietaryUpdates: Partial<CustomerPreferences>
  ) => {
    const customer = await customerCrud.getById(customerId);
    if (!customer.success || !customer.data) {
      return ApiResponseBuilder.error("Customer not found", {} as Customer);
    }

    const updatedPreferences = {
      ...customer.data.preferences,
      ...dietaryUpdates,
    };

    return customerCrud.update(
      customerId,
      { preferences: updatedPreferences } as any,
      "Dietary preferences updated successfully"
    );
  },

  // ========== UTILITY OPERATIONS ==========
  getCustomerByEmail: async (email: string) => {
    const customers = await customerCrud.search({ email });
    if (customers.success && customers.data.length > 0) {
      return ApiResponseBuilder.success(customers.data[0], "Customer found");
    }
    return ApiResponseBuilder.error("Customer not found", null);
  },

  customerExists: (customerId: string) => customerCrud.exists(customerId),
};
