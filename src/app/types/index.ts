// Theme Types
export interface ThemeState {
  mode: "light" | "dark";
  color: "blue" | "green" | "purple";
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  ingredients: string[];
  isAvailable: boolean;
  preparationTime: number;
  rating: number;
  spiceLevel: 0 | 1 | 2 | 3;
  dietaryInfo?: DietaryInfo;
}

export interface DietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
  calories?: number;
  allergens: string[];
}

export interface MenuResponse {
  categories: string[];
  items: MenuItem[];
}

// Cart Types
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
  dietaryRequirements?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

// Order Types
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  createdAt: string;
  estimatedDelivery: string;
  deliveryInstructions?: string;
  specialRequirements?: string;
}

// Customer Types
export interface CustomerAddress {
  id: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
  deliveryInstructions?: string;
  dietaryRestrictionsNote?: string;
  customerId?: string;
}

export interface PaymentMethod {
  id: string;
  type: "cash" | "card" | "digital_wallet";
  isDefault: boolean;
  cardLastFour?: string;
  cardType?: "visa" | "mastercard" | "amex";
  expiryDate?: string;
  customerId?: string;
}

export interface CustomerReview {
  id: string;
  menuItemId: string;
  menuItemName: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
  helpful: number;
  dietaryComment?: string;
  customerId?: string;
}

export interface CustomerPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dietary: string[];
  favoriteCuisines: string[];
  spicePreference: "mild" | "medium" | "hot" | "extra_hot";
  deliveryInstructions?: string;
  specialRequirements?: string;
  cutleryPreference: "include" | "do_not_include" | "ask_each_time";
  contactlessDelivery: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferences: CustomerPreferences;
  addresses: CustomerAddress[];
  paymentMethods: PaymentMethod[];
  reviews: CustomerReview[];
  loyaltyPoints: number;
  joinedDate: string;
  lastOrderDate?: string;
  dietaryRestrictions?: string[];
}

export interface OrderHistory {
  id: string;
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    specialInstructions?: string;
    dietaryRequirements?: string;
  }>;
  total: number;
  status: "completed" | "cancelled" | "refunded";
  orderDate: string;
  deliveryAddress: CustomerAddress;
  restaurant: {
    id: string;
    name: string;
    image: string;
  };
  deliveryInstructions?: string;
  specialRequirements?: string;
  rating?: number;
  review?: string;
  customerId: string;
}

// Delivery Types
export interface DeliveryInstruction {
  id: string;
  type: "leave_at_door" | "hand_to_me" | "leave_with_neighbor" | "other";
  message: string;
  isDefault: boolean;
}

export interface DietaryRestriction {
  id: string;
  type: "allergy" | "intolerance" | "preference" | "religious";
  name: string;
  severity: "mild" | "moderate" | "severe";
  description?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  dietaryOptions: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: "order_update" | "promotion" | "system" | "review_reminder";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  orderId?: string;
}
