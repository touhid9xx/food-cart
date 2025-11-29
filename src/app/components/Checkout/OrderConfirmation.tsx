/* eslint-disable react/no-unescaped-entities */
"use client";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { resetCheckout } from "../../lib/slices/checkoutSlice";

export default function OrderConfirmation() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get orderTotal from checkout state (not cart state)
  const { orderId, paymentMethod, shippingAddress, orderTotal } =
    useAppSelector((state) => state.checkout);

  // Calculate delivery time safely
  const deliveryTime = new Date();
  deliveryTime.setMinutes(deliveryTime.getMinutes() + 45);
  const estimatedDelivery = deliveryTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleNewOrder = () => {
    dispatch(resetCheckout());
    router.push("/menu");
  };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold theme-accent mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-2">
        Thank you for your order. We're preparing your food with love!
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-8">
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="font-semibold">Order ID:</span>
            <span className="theme-accent font-mono">
              {orderId || "ORD-123456789"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Payment Method:</span>
            <span className="capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span className="theme-accent font-bold">
              ${orderTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Delivery To:</span>
            <span className="text-right">
              {shippingAddress.address}, {shippingAddress.city}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Estimated Delivery:</span>
            <span className="text-green-600 font-semibold">
              {estimatedDelivery}
            </span>
          </div>
        </div>
      </div>

      {paymentMethod === "cash" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto mb-8">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-yellow-800 font-semibold">
              Please have ${orderTotal.toFixed(2)} ready for cash payment
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleNewOrder}
          className="w-full md:w-auto px-8 py-3 bg-theme-accent text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          Order Again
        </button>
        <div>
          <p className="text-sm text-gray-500">
            Need help? Call us at{" "}
            <span className="theme-accent font-semibold">1-800-FOOD-ORDER</span>
          </p>
        </div>
      </div>
    </div>
  );
}
