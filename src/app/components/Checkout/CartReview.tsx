"use client";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { removeFromCart, updateQuantity } from "../../lib/slices/cartSlice";
import { setCheckoutStep } from "../../lib/slices/checkoutSlice";

export default function CartReview() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);

  const handleProceed = () => {
    if (items.length > 0) {
      dispatch(setCheckoutStep("details"));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold theme-accent mb-8">
        Review Your Order
      </h1>

      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-theme-accent font-bold">
                  ${item.price.toFixed(2)}
                </p>
                {item.specialInstructions && (
                  <p className="text-sm text-gray-600 mt-1">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6 mb-8">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="theme-accent">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/menu")}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Continue Shopping
        </button>
        <button
          onClick={handleProceed}
          disabled={items.length === 0}
          className="flex-1 px-6 py-3 bg-theme-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
        >
          Proceed to Details
        </button>
      </div>
    </div>
  );
}
