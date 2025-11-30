/* eslint-disable @typescript-eslint/no-explicit-any */
// types/index.ts
// ========= THEME ==============
export interface ThemeState {
  mode: "light" | "dark";
  color: "blue" | "green" | "purple";
}

// ========== COMMON TYPES ==========
export type AlertType = "success" | "error" | "warning" | "info";

export type UserRole = "customer" | "admin" | "staff";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

// ========== ALERT & NOTIFICATION TYPES ==========
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

export interface Notification {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

// ========== AUTH TYPES ==========
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
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

// ========== API RESPONSE TYPES ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========== CUSTOMER TYPES ==========
export interface CustomerPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dietary: string[];
  favoriteCuisines: string[];
  spicePreference: "mild" | "medium" | "hot" | "extra-hot";
  deliveryInstructions: string;
  specialRequirements: string;
  cutleryPreference: "include" | "do_not_include";
  contactlessDelivery: boolean;
}

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
  type: "card" | "digital_wallet" | "cash";
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  customerId?: string;
}

export interface CustomerReview {
  id: string;
  menuItemId: string;
  menuItemName: string;
  rating: number;
  comment: string;
  createdAt: string;
  images: string[];
  helpful: number;
  dietaryComment?: string;
  customerId?: string;
}

export interface DietaryRestriction {
  id: string;
  type: "allergy" | "intolerance" | "preference" | "religious";
  name: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
}

export interface DeliveryInstruction {
  id: string;
  type: string;
  message: string;
  isDefault: boolean;
}

export interface Customer extends User {
  phone?: string;
  preferences: CustomerPreferences;
  addresses: CustomerAddress[];
  paymentMethods: PaymentMethod[];
  reviews: CustomerReview[];
  dietaryRestrictions: string[];
  loyaltyPoints: number;
  joinedDate: string;
  lastOrderDate: string;
}

// ========== ORDER TYPES ==========
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  specialInstructions?: string;
  dietaryRequirements?: string;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  image?: string;
  phone?: string;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating?: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  dietaryRequirements?: string;
  restaurant: RestaurantInfo;
  deliveryDriver?: DeliveryDriver;
  customerId?: string;
}

export interface OrderHistory extends OrderSummary {
  rating?: number;
  review?: string;
  deliveryInstructions: string;
  specialRequirements: string;
}

export interface OrderSearchCriteria {
  searchTerm?: string;
  customerName?: string;
  orderId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  restaurantId?: string;
}

// ========== MENU TYPES ==========
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
  type: "radio" | "checkbox" | "select";
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
    available: boolean;
  }[];
}

export interface Deal {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "bogo";
  value: number;
  description: string;
  validUntil: string;
  minOrderAmount?: number;
  applicableItems: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  rating: number;
  spiceLevel: number;
}

export interface MenuItemDetails extends MenuItem {
  images: string[];
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  allergens: string[];
  servingSize: string;
  cookingInstructions: string;
  customizationOptions: CustomizationOption[];
  deals: Deal[];
  relatedItems: string[];
  popularityScore: number;
  tags: string[];
  chefRecommendation: boolean;
  seasonal: boolean;
}

export interface MenuItemReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verifiedPurchase: boolean;
}

export interface MenuResponse {
  categories: string[];
  items: MenuItemDetails[];
}

// ========== FORM & VALIDATION TYPES ==========
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "textarea"
    | "select";
  required?: boolean;
  placeholder?: string;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
  options?: { value: string; label: string }[];
}

export interface FormError {
  field: string;
  message: string;
}

// ========== DASHBOARD & ANALYTICS TYPES ==========
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface PopularItem {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

// ========== SETTINGS TYPES ==========
export interface AppSettings {
  theme: "light" | "dark" | "auto";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    dataSharing: boolean;
  };
}

// ========== FILE UPLOAD TYPES ==========
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// ========== SEARCH & FILTER TYPES ==========
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  dietary?: string[];
  sortBy?: "name" | "price" | "rating" | "popularity";
  sortOrder?: "asc" | "desc";
}

// ========== PAGINATION TYPES ==========
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}
