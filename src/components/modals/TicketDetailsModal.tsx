"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import {
  getTicketDetailsAdmin,
  replyToTicketAdmin,
  updateTicketStatus,
} from "@/store/api/support";
import { useToast } from "@/contexts/ToastContext";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaPaperPlane,
  FaImage,
} from "react-icons/fa";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  images: string[];
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface Reply {
  id: string;
  message: string;
  attachments: string[];
  repliedBy: string;
  repliedByType: string;
  createdAt: string;
  replier: {
    fullName?: string;
    name?: string;
  };
}

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onUpdate: () => void;
}

export default function TicketDetailsModal({
  isOpen,
  onClose,
  ticket,
  onUpdate,
}: TicketDetailsModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [category, setCategory] = useState(ticket.category);

  useEffect(() => {
    if (isOpen) {
      fetchTicketDetails();
    }
  }, [isOpen]);

  const fetchTicketDetails = async () => {
    try {
      setRepliesLoading(true);
      const response = await getTicketDetailsAdmin(ticket.id);
      setReplies(response.replies || []);
    } catch (error: any) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() && selectedImages.length === 0) {
      toast.error("Please enter a message or attach an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("message", replyMessage);
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      await replyToTicketAdmin(ticket.id, formData);
      toast.success("Reply sent successfully");
      setReplyMessage("");
      setSelectedImages([]);
      fetchTicketDetails();
      onUpdate();
    } catch (error: any) {
      console.error("Error sending reply:", error);
      toast.error(error.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      await updateTicketStatus(ticket.id, {
        status,
        priority,
        category,
      });
      toast.success("Ticket updated successfully");
      onUpdate();
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      toast.error(error.message || "Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedImages.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      setSelectedImages([...selectedImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
          style={{ backgroundColor: colors.offYellow }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
              Ticket Details
            </h2>
            <p className="text-gray-600 mt-1">{ticket.ticketNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* User Information */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUser color={colors.primeYellow} />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{ticket.user?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <FaEnvelope size={14} />
                  {ticket.user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium flex items-center gap-2">
                  <FaPhone size={14} />
                  {ticket.user?.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold text-lg">{ticket.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
              {ticket.images && ticket.images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.images.map((image, index) => (
                      <a
                        key={index}
                        href={image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock size={14} />
                Created: {formatDate(ticket.createdAt)}
              </div>
            </div>
          </div>

          {/* Update Status Section */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Update Ticket</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                  <option value="consultation">Consultation</option>
                  <option value="general">General</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleUpdateStatus}
              disabled={loading}
              className="px-6 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: colors.primeYellow }}
            >
              {loading ? "Updating..." : "Update Ticket"}
            </button>
          </div>

          {/* Replies Section */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Conversation</h3>
            {repliesLoading ? (
              <div className="text-center py-8">
                <div
                  className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
                  style={{ borderColor: colors.primeYellow }}
                ></div>
              </div>
            ) : replies.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No replies yet. Be the first to respond!
              </p>
            ) : (
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.repliedByType === "admin"
                        ? "bg-blue-50 ml-8"
                        : "bg-gray-50 mr-8"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold">
                        {reply.repliedByType === "admin" ? (
                          <span className="text-blue-600">
                            Admin: {reply.replier?.name || "Admin"}
                          </span>
                        ) : (
                          <span className="text-gray-800">
                            {reply.replier?.fullName || "User"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </div>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {reply.message}
                    </p>
                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reply.attachments.map((att, index) => (
                          <a
                            key={index}
                            href={att}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={att}
                              alt={`Attachment ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Send Reply</h3>
            <div className="space-y-4">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800">
                  <FaImage />
                  <span className="text-sm">Attach Images (Max 5)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg text-white flex items-center gap-2 transition-colors disabled:opacity-50"
                  style={{ backgroundColor: colors.primeYellow }}
                >
                  <FaPaperPlane />
                  {loading ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
