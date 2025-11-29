"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { closeCart } from "../lib/slices/cartSlice";
import { setCheckoutStep } from "../lib/slices/checkoutSlice";
import CartReview from "../components/Checkout/CartReview";
import ShippingDetails from "../components/Checkout/ShippingDetails";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderConfirmation from "../components/Checkout/OrderConfirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { step } = useAppSelector((state) => state.checkout);

  useEffect(() => {
    // Close cart sidebar when checkout starts
    dispatch(closeCart());

    // Redirect if cart is empty
    if (items.length === 0 && step === "cart") {
      router.push("/menu");
    }
  }, [items.length, step, dispatch, router]);

  const renderStep = () => {
    switch (step) {
      case "cart":
        return <CartReview />;
      case "details":
        return <ShippingDetails />;
      case "payment":
        return <PaymentMethod />;
      case "confirmation":
        return <OrderConfirmation />;
      default:
        return <CartReview />;
    }
  };

  const getStepNumber = (stepName: string) => {
    const steps = ["cart", "details", "payment", "confirmation"];
    return steps.indexOf(stepName) + 1;
  };

  const steps = [
    { id: "cart", name: "Cart Review" },
    { id: "details", name: "Details" },
    { id: "payment", name: "Payment" },
    { id: "confirmation", name: "Confirmation" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all ${
                    getStepNumber(step) >= getStepNumber(stepItem.id)
                      ? "bg-theme-accent border-theme-accent text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {getStepNumber(stepItem.id)}
                </div>
                <span
                  className={`ml-3 font-medium ${
                    getStepNumber(step) >= getStepNumber(stepItem.id)
                      ? "text-theme-accent"
                      : "text-gray-500"
                  }`}
                >
                  {stepItem.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-6 ${
                      getStepNumber(step) > getStepNumber(stepItem.id)
                        ? "bg-theme-accent"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
