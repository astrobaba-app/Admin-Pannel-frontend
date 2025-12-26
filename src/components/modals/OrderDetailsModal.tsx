"use client";

import React, { useState } from "react";
import { colors } from "@/utils/colors";
import { updateOrderStatus } from "@/store/api/store";
import { useToast } from "@/contexts/ToastContext";
import { FaTimes, FaTruck, FaBox, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

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
  trackingUrl?: string;
  adminNotes?: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onUpdate: () => void;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onUpdate,
}: OrderDetailsModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [courierName, setCourierName] = useState(order.courierName || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");

  if (!isOpen) return null;

  const handleUpdateOrder = async () => {
    try {
      setLoading(true);
      await updateOrderStatus(order.orderNumber, {
        orderStatus,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        trackingUrl: trackingUrl || undefined,
        adminNotes: adminNotes || undefined,
      });
      toast.success("Order updated successfully");
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast.error(error.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ backgroundColor: colors.offYellow }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
              Order Details
            </h2>
            <p className="text-gray-600 mt-1">{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Customer Information */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUser color={colors.primeYellow} />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{order.user?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <FaEnvelope size={14} />
                  {order.user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium flex items-center gap-2">
                  <FaPhone size={14} />
                  {order.user?.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt color={colors.primeYellow} />
                Delivery Address
              </h3>
              <div className="text-sm">
                <p className="font-medium">{order.deliveryAddress.fullName}</p>
                <p className="text-gray-600 mt-1">
                  {order.deliveryAddress.addressLine1}
                  {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                </p>
                <p className="text-gray-600">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                </p>
                {order.deliveryAddress.landmark && (
                  <p className="text-gray-600">Landmark: {order.deliveryAddress.landmark}</p>
                )}
                <p className="text-gray-600 mt-2">
                  <FaPhone size={12} className="inline mr-2" />
                  {order.deliveryAddress.phone}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBox color={colors.primeYellow} />
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.offYellow }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items?.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <span className="font-medium">{item.productName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.productType === 'digital' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {formatStatus(item.productType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(parseFloat(item.price))}
                      </td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(parseFloat(item.price) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(parseFloat(order.subtotal.toString()))}</span>
              </div>
              {parseFloat(order.discount.toString()) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(parseFloat(order.discount.toString()))}</span>
                </div>
              )}
              {parseFloat(order.shippingCharges.toString()) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Charges</span>
                  <span className="font-medium">{formatCurrency(parseFloat(order.shippingCharges.toString()))}</span>
                </div>
              )}
              {parseFloat(order.taxAmount.toString()) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(parseFloat(order.taxAmount.toString()))}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total Amount</span>
                <span style={{ color: colors.primeYellow }}>
                  {formatCurrency(parseFloat(order.totalAmount.toString()))}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Order Info */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Payment Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : 
                    'text-orange-600'
                  }`}>
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Order Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{formatStatus(order.orderType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placed On</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Order Status */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaTruck color={colors.primeYellow} />
              Update Order Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Order Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Courier Name
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g., FedEx, DHL, BlueDart"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tracking URL
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Admin Notes (Internal)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any internal notes about this order..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: colors.primeYellow }}
              >
                {loading ? "Updating..." : "Update Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
