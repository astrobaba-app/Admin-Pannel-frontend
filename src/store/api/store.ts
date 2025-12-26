import api from "@/store/api/index";

// Get all products
export const getAllProducts = async (params?: any) => {
  try {
    const response = await api.get("/store/products", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get single product
export const getProductById = async (productId: string) => {
  try {
    const response = await api.get(`/store/products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Create product
export const createProduct = async (formData: FormData) => {
  try {
    const response = await api.post("/store/admin/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Update product
export const updateProduct = async (productId: string, formData: FormData) => {
  try {
    const response = await api.put(
      `/store/admin/products/${productId}`,
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

// Delete product
export const deleteProduct = async (productId: string) => {
  try {
    const response = await api.delete(`/store/admin/products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Toggle product status
export const toggleProductStatus = async (productId: string) => {
  try {
    const response = await api.patch(
      `/store/admin/products/${productId}/toggle-status`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get categories
export const getCategories = async () => {
  try {
    const response = await api.get("/store/products/categories");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
