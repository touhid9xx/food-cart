import { CartItem } from "../../types";

// Fake API delay simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface OrderData {
  items: CartItem[];
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    instructions: string;
  };
  paymentMethod: "cash" | "card";
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  message: string;
  estimatedDelivery: string;
  total: number;
}

export const checkoutApi = {
  // Process order
  processOrder: async (orderData: OrderData): Promise<OrderResponse> => {
    await delay(2000); // Simulate processing time

    // Simulate random success/failure for card payments
    if (orderData.paymentMethod === "card") {
      // Simple card validation
      const cardNumber = orderData.cardDetails?.number.replace(/\s/g, "");
      if (
        !cardNumber ||
        cardNumber.length !== 16 ||
        !/^\d+$/.test(cardNumber)
      ) {
        throw new Error("Invalid card number");
      }

      if (!orderData.cardDetails?.expiry || !orderData.cardDetails?.cvv) {
        throw new Error("Invalid card details");
      }

      // Simulate random payment failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Payment declined. Please try another card.");
      }
    }

    // Generate fake order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Calculate estimated delivery (30-45 minutes from now)
    const now = new Date();
    const deliveryTime = new Date(
      now.getTime() + (30 + Math.random() * 15) * 60000
    );

    return {
      success: true,
      orderId,
      message:
        orderData.paymentMethod === "cash"
          ? "Order placed successfully! Please have cash ready for delivery."
          : "Payment successful! Your order has been placed.",
      estimatedDelivery: deliveryTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      total: orderData.total,
    };
  },

  // Validate card details
  validateCard: async (cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  }): Promise<{ valid: boolean; message?: string }> => {
    await delay(1000);

    const cardNumber = cardDetails.number.replace(/\s/g, "");

    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      return { valid: false, message: "Invalid card number" };
    }

    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      return { valid: false, message: "Invalid expiry date" };
    }

    if (
      !cardDetails.cvv ||
      cardDetails.cvv.length !== 3 ||
      !/^\d+$/.test(cardDetails.cvv)
    ) {
      return { valid: false, message: "Invalid CVV" };
    }

    if (!cardDetails.name.trim()) {
      return { valid: false, message: "Cardholder name is required" };
    }

    return { valid: true };
  },
};
