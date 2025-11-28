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

export interface MenuItemDetails extends MenuItem {
  nutritionalInfo?: NutritionalInfo;
  allergens: string[];
  cookingInstructions?: string;
  servingSize: string;
  customizationOptions: CustomizationOption[];
  deals: Deal[];
  relatedItems: string[];
  popularityScore: number;
  tags: string[];
  chefRecommendation: boolean;
  seasonal: boolean;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: "radio" | "checkbox" | "number";
  options: CustomizationChoice[];
  required: boolean;
  maxSelections?: number;
}

export interface CustomizationChoice {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface Deal {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "bogo" | "combo";
  value: number;
  description: string;
  validUntil?: string;
  minOrderAmount?: number;
  applicableItems: string[];
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

export interface MenuItemReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  images?: string[];
  verifiedPurchase: boolean;
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

// Auth Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "staff";
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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

// Alert Types
export type AlertType = "success" | "error" | "warning" | "info";

export interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export interface AlertState {
  alerts: Alert[];
  position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxAlerts: number;
}
