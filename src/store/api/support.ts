import api from "@/store/api/index";

// ==================== USER SUPPORT APIs ====================

// Create support ticket
export const createSupportTicket = async (formData: FormData) => {
  try {
    const response = await api.post("/support/user/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get user's tickets
export const getMyTickets = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get("/support/user/my-tickets", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get ticket details
export const getTicketDetails = async (ticketId: string) => {
  try {
    const response = await api.get(`/support/user/ticket/${ticketId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Reply to ticket
export const replyToTicket = async (ticketId: string, message: string) => {
  try {
    const response = await api.post(`/support/user/ticket/${ticketId}/reply`, {
      message,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ==================== ADMIN SUPPORT APIs ====================

// Get all support tickets (admin)
export const getAllSupportTickets = async (params?: {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get("/support/admin/tickets", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get ticket details (admin)
export const getTicketDetailsAdmin = async (ticketId: string) => {
  try {
    const response = await api.get(`/support/admin/ticket/${ticketId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Reply to ticket (admin)
export const replyToTicketAdmin = async (
  ticketId: string,
  formData: FormData
) => {
  try {
    const response = await api.post(
      `/support/admin/ticket/${ticketId}/reply`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Update ticket status (admin)
export const updateTicketStatus = async (
  ticketId: string,
  data: {
    status?: string;
    priority?: string;
    category?: string;
  }
) => {
  try {
    const response = await api.patch(
      `/support/admin/ticket/${ticketId}/status`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get ticket statistics (admin)
export const getTicketStatistics = async () => {
  try {
    const response = await api.get("/support/admin/tickets/statistics");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
