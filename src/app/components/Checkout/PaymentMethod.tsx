"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  setPaymentMethod,
  updateCardDetails,
  setCheckoutStep,
  setLoading,
  setOrderTotal, // Add this import
} from "../../lib/slices/checkoutSlice";
import { clearCart } from "../../lib/slices/cartSlice";
import { checkoutApi } from "../../lib/api/checkoutApi";
import { useAlert } from "../../lib/hooks/useAlert";

export default function PaymentMethod() {
  const dispatch = useAppDispatch();
  const { success, error } = useAlert();
  const { paymentMethod, cardDetails, shippingAddress } = useAppSelector(
    (state) => state.checkout
  );
  const { items, total } = useAppSelector((state) => state.cart);
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "card" | null>(
    paymentMethod
  );
  const [cardData, setCardData] = useState(cardDetails);

  const handleCardChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches ? matches[0] : "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) {
      error("Please select a payment method", "Payment Method Required");
      return;
    }

    if (selectedMethod === "card") {
      // Validate card details
      const validation = await checkoutApi.validateCard(cardData);
      if (!validation.valid) {
        error(validation.message || "Invalid card details", "Card Error");
        return;
      }
    }

    dispatch(setLoading(true));

    // STORE THE ORDER TOTAL BEFORE CLEARING CART
    dispatch(setOrderTotal(total));
    dispatch(setPaymentMethod(selectedMethod));

    if (selectedMethod === "card") {
      dispatch(updateCardDetails(cardData));
    }

    try {
      const orderData = {
        items,
        total,
        shippingAddress,
        paymentMethod: selectedMethod,
        cardDetails: selectedMethod === "card" ? cardData : undefined,
      };

      const result = await checkoutApi.processOrder(orderData);

      if (result.success) {
        dispatch(clearCart());
        success(result.message, "Order Placed!");
        dispatch(setCheckoutStep("confirmation"));
      }
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
        "Payment Error"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ... rest of the component remains the same
}
