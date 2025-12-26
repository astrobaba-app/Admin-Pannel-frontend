import api from "./index";

// Get admin profile
export const getAdminProfile = async () => {
  try {
    const response = await api.get("/admin/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Update admin profile
export const updateAdminProfile = async (data: { name?: string; email?: string }) => {
  try {
    const response = await api.put("/admin/profile", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Change admin password
export const changeAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await api.put("/admin/change-password", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Enable 2FA - Get QR code
export const enableTwoFactor = async () => {
  try {
    const response = await api.post("/admin/2fa/enable");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Verify 2FA setup
export const verifyTwoFactor = async (token: string) => {
  try {
    const response = await api.post("/admin/2fa/verify", { token });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Disable 2FA
export const disableTwoFactor = async (token: string) => {
  try {
    const response = await api.post("/admin/2fa/disable", { token });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
