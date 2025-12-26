"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import {
  getAllSupportTickets,
  getTicketStatistics,
} from "@/store/api/support";
import { useToast } from "@/contexts/ToastContext";
import {
  FaSearch,
  FaEye,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import TicketDetailsModal from "../../../components/modals/TicketDetailsModal";

interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  images: string[];
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  lastRepliedAt?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface Statistics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  byPriority: { priority: string; count: string }[];
  byCategory: { category: string; count: string }[];
}

export default function SupportTicketsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchTickets();
    fetchStatistics();
  }, [currentPage, filterStatus, filterPriority, filterCategory, searchQuery]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit,
      };

      if (filterStatus !== "all") params.status = filterStatus;
      if (filterPriority !== "all") params.priority = filterPriority;
      if (filterCategory !== "all") params.category = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await getAllSupportTickets(params);
      setTickets(response.tickets || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalTickets(response.pagination?.total || 0);
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      toast.error(error.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getTicketStatistics();
      const stats = response.statistics;
      setStatistics({
        total: stats.total,
        open: stats.byStatus.open,
        inProgress: stats.byStatus.inProgress,
        resolved: stats.byStatus.resolved,
        byPriority: [],
        byCategory: stats.byCategory || [],
      });
    } catch (error: any) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsModalOpen(true);
  };

  const handleTicketUpdate = () => {
    fetchTickets();
    fetchStatistics();
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      open: "#FFA500",
      in_progress: "#4169E1",
      resolved: "#228B22",
      closed: "#666",
    };
    return statusColors[status] || "#666";
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: Record<string, string> = {
      low: "#90EE90",
      medium: "#FFD700",
      high: "#FF8C00",
      urgent: "#DC143C",
    };
    return priorityColors[priority] || "#666";
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.black }}>
          Support Tickets
        </h1>
        <p className="text-gray-600">Manage and respond to user support requests</p>
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
                <p className="text-gray-600 text-sm">Total Tickets</p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.black }}
                >
                  {statistics.total}
                </p>
              </div>
              <FaTicketAlt size={40} color={colors.primeYellow} />
            </div>
          </div>

          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Open</p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#FFA500" }}
                >
                  {statistics.open}
                </p>
              </div>
              <FaClock size={40} color="#FFA500" />
            </div>
          </div>

          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#4169E1" }}
                >
                  {statistics.inProgress}
                </p>
              </div>
              <FaExclamationTriangle size={40} color="#4169E1" />
            </div>
          </div>

          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolved</p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#228B22" }}
                >
                  {statistics.resolved}
                </p>
              </div>
              <FaCheckCircle size={40} color="#228B22" />
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
              placeholder="Search by ticket number or subject..."
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

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="consultation">Consultation</option>
            <option value="general">General</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: colors.primeYellow }}
            ></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <FaTicketAlt size={50} color="#ccc" className="mx-auto mb-4" />
            <p className="text-gray-600">No tickets found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.offYellow }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ticket #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm font-medium"
                          style={{ color: colors.black }}
                        >
                          {ticket.ticketNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm font-medium"
                          style={{ color: colors.black }}
                        >
                          {ticket.user?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm font-medium"
                          style={{ color: colors.black }}
                        >
                          {ticket.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {formatStatus(ticket.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{
                            backgroundColor: getPriorityColor(ticket.priority),
                          }}
                        >
                          {formatStatus(ticket.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: getStatusColor(ticket.status) }}
                        >
                          {formatStatus(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewTicket(ticket)}
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
                  Showing page {currentPage} of {totalPages} ({totalTickets}{" "}
                  total tickets)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
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

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          onUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
}
