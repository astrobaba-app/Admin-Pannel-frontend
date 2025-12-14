import api from './index';
import { AxiosResponse } from 'axios';

// Auth Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  admin?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  token?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

const BASE_URL = '/admin';

/**
 * Admin login
 */
export const adminLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      `${BASE_URL}/login`,
      data
    );
    
    // Store token in localStorage
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to login',
      success: false
    };
  }
};

/**
 * Admin logout
 */
export const adminLogout = async (): Promise<LogoutResponse> => {
  try {
    const response: AxiosResponse<LogoutResponse> = await api.post(
      `${BASE_URL}/logout`
    );
    
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    
    return response.data;
  } catch (error: any) {
    // Still remove token even if request fails
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to logout',
      success: false
    };
  }
};
