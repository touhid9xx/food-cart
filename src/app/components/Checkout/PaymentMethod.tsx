"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  setPaymentMethod,
  updateCardDetails,
  setCheckoutStep,
  setLoading,
  setOrderTotal, // ADD THIS IMPORT
} from "../../../lib/slices/checkoutSlice";
import { clearCart } from "../../../lib/slices/cartSlice";
import { checkoutApi } from "../../../lib/api/checkoutApi";
import { useAlert } from "../../../lib/hooks/useAlert";

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

    // STORE THE ORDER TOTAL BEFORE CLEARING CART - THIS IS THE KEY FIX
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

  return (
    <div>
      <h1 className="text-3xl font-bold theme-accent mb-8">Payment Method</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Choose Payment Method
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash on Delivery */}
            <div
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedMethod === "cash"
                  ? "border-theme-accent bg-theme-accent/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setSelectedMethod("cash")}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "cash"
                      ? "border-theme-accent bg-theme-accent"
                      : "border-gray-400"
                  }`}
                >
                  {selectedMethod === "cash" && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Cash on Delivery
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pay when you receive your order
                  </p>
                </div>
                <div className="text-2xl ml-auto">💵</div>
              </div>
            </div>

            {/* Credit/Debit Card */}
            <div
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedMethod === "card"
                  ? "border-theme-accent bg-theme-accent/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setSelectedMethod("card")}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "card"
                      ? "border-theme-accent bg-theme-accent"
                      : "border-gray-400"
                  }`}
                >
                  {selectedMethod === "card" && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Credit/Debit Card
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pay securely with your card
                  </p>
                </div>
                <div className="text-2xl ml-auto">💳</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details Form */}
        {selectedMethod === "card" && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Card Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  required
                  value={cardData.name}
                  onChange={(e) => handleCardChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                  placeholder="Enter cardholder name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  value={cardData.number}
                  onChange={(e) =>
                    handleCardChange("number", formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  required
                  value={cardData.expiry}
                  onChange={(e) => handleCardChange("expiry", e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  required
                  value={cardData.cvv}
                  onChange={(e) =>
                    handleCardChange(
                      "cvv",
                      e.target.value.replace(/\D/g, "").slice(0, 3)
                    )
                  }
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Your payment is secure and encrypted</span>
            </div>
          </div>
        )}

        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={() => dispatch(setCheckoutStep("details"))}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Back to Details
          </button>
          <button
            type="submit"
            disabled={!selectedMethod}
            className="flex-1 px-6 py-3 bg-theme-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
