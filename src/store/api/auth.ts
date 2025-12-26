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
  requires2FA?: boolean;
  tempToken?: string;
  admin?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    twoFactorEnabled?: boolean;
  };
  token?: string;
}

export interface Verify2FALoginRequest {
  tempToken: string;
  code: string;
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

/**
 * Verify 2FA code during login
 */
export const verify2FALogin = async (data: Verify2FALoginRequest): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      `${BASE_URL}/verify-2fa-login`,
      data
    );
    
    // Store token in localStorage
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to verify 2FA code',
      success: false
    };
  }
};
