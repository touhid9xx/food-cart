/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchOrders,
  searchOrders,
  updateOrderStatus,
  setSearchTerm,
  setDateFilter,
  setStatusFilter,
  clearFilters,
  applyLocalFilters,
} from "../../../lib/slices/orderSummarySlice";

export default function Orders() {
  const dispatch = useAppDispatch();
  const {
    orders,
    filteredOrders,
    loading,
    error,
    searchTerm,
    dateFilter,
    statusFilter,
  } = useAppSelector((state) => state.orderSummary);

  const [localSearch, setLocalSearch] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: "",
    end: "",
  });

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Apply local filters when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
      dispatch(applyLocalFilters());
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(applyLocalFilters());
  };

  // Handle date range filter
  const handleDateFilter = () => {
    if (selectedDateRange.start && selectedDateRange.end) {
      dispatch(
        setDateFilter({
          startDate: selectedDateRange.start,
          endDate: selectedDateRange.end,
        })
      );
      dispatch(applyLocalFilters());
    }
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    dispatch(setStatusFilter(status === "all" ? null : status));
    dispatch(applyLocalFilters());
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocalSearch("");
    setSelectedDateRange({ start: "", end: "" });
    dispatch(clearFilters());
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(
        updateOrderStatus({
          orderId,
          status: newStatus as any,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-orange-100 text-orange-800 border-orange-200",
      ready: "bg-purple-100 text-purple-800 border-purple-200",
      out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  // Get status options for dropdown based on current status
  const getStatusOptions = (currentStatus: string) => {
    const statusFlow: { [key: string]: string[] } = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["ready", "cancelled"],
      ready: ["out_for_delivery", "cancelled"],
      out_for_delivery: ["delivered", "cancelled"],
      delivered: [],
      cancelled: ["confirmed"],
    };
    return statusFlow[currentStatus] || [];
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    revenue: orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all customer orders
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.preparing}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Filters & Search
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search Orders
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search by order number, customer name, or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={statusFilter || "all"}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={selectedDateRange.start}
                    onChange={(e) =>
                      setSelectedDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={selectedDateRange.end}
                    onChange={(e) =>
                      setSelectedDateRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleDateFilter}
                  disabled={!selectedDateRange.start || !selectedDateRange.end}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Date
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders ({filteredOrders.length})
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center">
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                <p className="font-semibold">Error loading orders</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Orders Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.orderDate)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.restaurant.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customerEmail}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customerPhone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.map((item, index) => (
                              <div
                                key={item.id}
                                className="flex justify-between"
                              >
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-gray-500 ml-4">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">
                            ${order.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {order.paymentMethod} • {order.paymentStatus}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.replace(/_/g, " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <select
                              value=""
                              onChange={(e) =>
                                handleUpdateStatus(order.id, e.target.value)
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={
                                getStatusOptions(order.status).length === 0
                              }
                            >
                              <option value="">Update Status</option>
                              {getStatusOptions(order.status).map((status) => (
                                <option key={status} value={status}>
                                  {status.replace(/_/g, " ").toUpperCase()}
                                </option>
                              ))}
                            </select>
                            <button className="text-blue-600 hover:text-blue-900 text-sm">
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
