"use client";
import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import { getAllOrders, getOrderStatistics } from "@/store/api/store";
import { useToast } from "@/contexts/ToastContext";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaBoxOpen,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import OrderDetailsModal from "../../../components/modals/OrderDetailsModal";

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: any[];
  subtotal: number;
  discount: number;
  shippingCharges: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderType: string;
  orderStatus: string;
  deliveryAddress: any;
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface Statistics {
  total: number;
  recent: number;
  byStatus: { orderStatus: string; count: string }[];
  byType: { orderType: string; count: string }[];
  revenue: {
    total: string;
    average: string;
  };
}

export default function OrdersPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [currentPage, filterStatus, filterType, filterPayment, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit,
      };

      if (filterStatus !== "all") params.orderStatus = filterStatus;
      if (filterType !== "all") params.orderType = filterType;
      if (filterPayment !== "all") params.paymentStatus = filterPayment;
      if (searchQuery) params.search = searchQuery;

      const response = await getAllOrders(params);
      setOrders(response.orders || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalOrders(response.pagination?.total || 0);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getOrderStatistics(30);
      setStatistics(response.statistics);
    } catch (error: any) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleOrderUpdate = () => {
    fetchOrders();
    fetchStatistics();
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "#FFA500",
      confirmed: "#4169E1",
      processing: "#9370DB",
      packed: "#20B2AA",
      shipped: "#32CD32",
      out_for_delivery: "#00CED1",
      delivered: "#228B22",
      cancelled: "#DC143C",
      refunded: "#8B0000",
    };
    return statusColors[status] || "#666";
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "#FFA500",
      completed: "#228B22",
      failed: "#DC143C",
      refunded: "#8B0000",
    };
    return statusColors[status] || "#666";
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate profit (assuming 30% profit margin for demo - you can adjust this)
  const calculateProfit = (totalAmount: number, items: any[]) => {
    // This is a simplified calculation. You might want to store actual cost in product
    const profitMargin = 0.3; // 30% profit
    return totalAmount * profitMargin;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.black }}>
          Order Management
        </h1>
        <p className="text-gray-600">
          Manage and track all store orders
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.black }}>
                  {statistics.total}
                </p>
              </div>
              <FaShoppingCart size={40} color={colors.primeYellow} />
            </div>
          </div>

          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Recent (30 days)</p>
                <p className="text-3xl font-bold mt-2" style={{ color: colors.black }}>
                  {statistics.recent}
                </p>
              </div>
              <FaChartLine size={40} color="#4169E1" />
            </div>
          </div>

          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold mt-2" style={{ color: colors.black }}>
                  {formatCurrency(parseFloat(statistics.revenue.total))}
                </p>
              </div>
              <FaDollarSign size={40} color="#228B22" />
            </div>
          </div>

          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold mt-2" style={{ color: colors.black }}>
                  {formatCurrency(parseFloat(statistics.revenue.average))}
                </p>
              </div>
              <FaBoxOpen size={40} color="#9370DB" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              color="#999"
            />
          </div>

          {/* Order Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Order Type Filter */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All Types</option>
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
            <option value="mixed">Mixed</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={filterPayment}
            onChange={(e) => {
              setFilterPayment(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primeYellow }}></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <FaBoxOpen size={50} color="#ccc" className="mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.offYellow }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: colors.black }}>
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium" style={{ color: colors.black }}>
                          {order.user?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                        <div className="text-sm text-gray-500">{order.user?.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: colors.black }}>
                          {order.items?.length || 0} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold" style={{ color: colors.black }}>
                          {formatCurrency(parseFloat(order.totalAmount.toString()))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(calculateProfit(parseFloat(order.totalAmount.toString()), order.items))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {formatStatus(order.orderType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                        >
                          {formatStatus(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: getPaymentStatusColor(order.paymentStatus) }}
                        >
                          {formatStatus(order.paymentStatus)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatStatus(order.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="px-3 py-1 rounded-lg flex items-center gap-2 hover:opacity-80"
                          style={{ backgroundColor: colors.primeYellow }}
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages} ({totalOrders} total orders)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
