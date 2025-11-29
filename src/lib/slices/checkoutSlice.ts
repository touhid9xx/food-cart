import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CheckoutState {
  step: "cart" | "details" | "payment" | "confirmation";
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    instructions: string;
  };
  paymentMethod: "cash" | "card" | null;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  orderId: string | null;
  orderTotal: number; // Add this line
  isLoading: boolean;
}

const initialState: CheckoutState = {
  step: "cart",
  shippingAddress: {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    instructions: "",
  },
  paymentMethod: null,
  cardDetails: {
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  },
  orderId: null,
  orderTotal: 0, // Add this line
  isLoading: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutStep: (state, action: PayloadAction<CheckoutState["step"]>) => {
      state.step = action.payload;
    },
    updateShippingAddress: (
      state,
      action: PayloadAction<Partial<CheckoutState["shippingAddress"]>>
    ) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload };
    },
    setPaymentMethod: (state, action: PayloadAction<"cash" | "card">) => {
      state.paymentMethod = action.payload;
    },
    updateCardDetails: (
      state,
      action: PayloadAction<Partial<CheckoutState["cardDetails"]>>
    ) => {
      state.cardDetails = { ...state.cardDetails, ...action.payload };
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    setOrderTotal: (state, action: PayloadAction<number>) => {
      // Add this action
      state.orderTotal = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetCheckout: (state) => {
      state.step = "cart";
      state.shippingAddress = initialState.shippingAddress;
      state.paymentMethod = null;
      state.cardDetails = initialState.cardDetails;
      state.orderId = null;
      state.orderTotal = 0; // Reset this too
      state.isLoading = false;
    },
  },
});

export const {
  setCheckoutStep,
  updateShippingAddress,
  setPaymentMethod,
  updateCardDetails,
  setOrderId,
  setOrderTotal, // Export this
  setLoading,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
