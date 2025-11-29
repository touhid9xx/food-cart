"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../lib/hooks";
import {
  updateShippingAddress,
  setCheckoutStep,
} from "../../../lib/slices/checkoutSlice";

export default function ShippingDetails() {
  const dispatch = useAppDispatch();
  const { shippingAddress } = useAppSelector((state) => state.checkout);
  const [formData, setFormData] = useState(shippingAddress);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateShippingAddress(formData));
    dispatch(setCheckoutStep("payment"));
  };

  const canProceed =
    formData.fullName &&
    formData.address &&
    formData.city &&
    formData.postalCode &&
    formData.phone;

  return (
    <div>
      <h1 className="text-3xl font-bold theme-accent mb-8">Delivery Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              placeholder="Enter your full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              required
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              placeholder="Enter postal code"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Instructions (Optional)
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleChange("instructions", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              placeholder="Any special delivery instructions..."
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={() => dispatch(setCheckoutStep("cart"))}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={!canProceed}
            className="flex-1 px-6 py-3 bg-theme-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
