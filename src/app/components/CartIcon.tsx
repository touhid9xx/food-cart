"use client";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { toggleCart } from "../lib/slices/cartSlice";

export default function CartIcon() {
  const dispatch = useAppDispatch();
  const { itemCount } = useAppSelector((state) => state.cart);

  return (
    <button
      onClick={() => dispatch(toggleCart())}
      className="relative p-2 rounded-lg hover:bg-white/30 backdrop-blur-sm transition-all duration-300 text-white"
      aria-label="Shopping cart"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}
