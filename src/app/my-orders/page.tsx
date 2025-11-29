/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { customerApi } from "../../lib/api/customerApi";
import { OrderHistory } from "../../types";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await customerApi.getOrderHistory("cust_1");
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      case "refunded":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 border-red-500/30";
      case "refunded":
        return "bg-yellow-500/20 border-yellow-500/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-24 bg-gray-300 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold theme-accent">My Orders</h1>
            <div className="text-sm opacity-80">
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📦</div>
              <h3 className="text-2xl font-semibold mb-3 theme-accent">
                No Orders Yet
              </h3>
              <p className="opacity-80 mb-6">
                You haven't placed any orders yet.
              </p>
              <a
                href="/menu"
                className="theme-button px-8 py-3 rounded-lg font-semibold inline-block"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glassmorphism rounded-xl p-6 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <h3 className="text-xl font-semibold theme-accent">
                          {order.orderNumber}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-sm border ${getStatusBg(
                            order.status
                          )} ${getStatusColor(order.status)}`}
                        >
                          {order.status.toUpperCase()}
                        </div>
                      </div>

                      <p className="text-sm opacity-80">
                        Ordered on{" "}
                        {new Date(order.orderDate).toLocaleDateString()} at{" "}
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </p>

                      <div className="space-y-2">
                        <p className="font-medium">{order.restaurant.name}</p>
                        <p className="text-sm opacity-90">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}:{" "}
                          {order.items
                            .map((item) => `${item.name} (x${item.quantity})`)
                            .join(", ")}
                        </p>

                        {order.deliveryInstructions && (
                          <p className="text-sm opacity-80">
                            📝 Delivery: {order.deliveryInstructions}
                          </p>
                        )}

                        {order.specialRequirements && (
                          <p className="text-sm opacity-80">
                            🚨 Special: {order.specialRequirements}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-4 lg:mt-0 lg:pl-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold theme-accent">
                          ${order.total.toFixed(2)}
                        </p>
                        {order.rating && (
                          <p className="text-sm opacity-80 mt-1">
                            ⭐ {order.rating}/5
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setSelectedOrder(
                              selectedOrder?.id === order.id ? null : order
                            )
                          }
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                        >
                          {selectedOrder?.id === order.id ? "Hide" : "Details"}
                        </button>

                        {order.status === "completed" && !order.review && (
                          <button className="px-4 py-2 theme-accent bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300">
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details Expandable Section */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <h4 className="font-semibold mb-4">Order Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3">Items</h5>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    {item.specialInstructions && (
                                      <p className="text-xs opacity-70">
                                        {item.specialInstructions}
                                      </p>
                                    )}
                                    {item.dietaryRequirements && (
                                      <p className="text-xs text-theme-accent">
                                        {item.dietaryRequirements}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p>${item.price.toFixed(2)}</p>
                                  <p className="text-sm opacity-70">
                                    x{item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">
                            Delivery Information
                          </h5>
                          <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-sm opacity-80">Address</p>
                              <p>
                                {order.deliveryAddress.street},{" "}
                                {order.deliveryAddress.city}
                              </p>
                            </div>
                            {order.deliveryAddress.deliveryInstructions && (
                              <div>
                                <p className="text-sm opacity-80">
                                  Instructions
                                </p>
                                <p>
                                  {order.deliveryAddress.deliveryInstructions}
                                </p>
                              </div>
                            )}
                          </div>

                          {order.review && (
                            <div className="mt-4 p-4 bg-white/5 rounded-lg">
                              <h5 className="font-medium mb-2">Your Review</h5>
                              <p className="text-sm opacity-90">
                                {order.review}
                              </p>
                              {order.rating && (
                                <p className="text-sm theme-accent mt-2">
                                  ⭐ {order.rating}/5 Rating
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
