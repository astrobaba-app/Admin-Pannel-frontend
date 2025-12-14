import api from './index';
import { AxiosResponse } from 'axios';

// User Interfaces
export interface User {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  dateOfbirth: string | null;
  gender: string | null;
  placeOfBirth: string | null;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

const BASE_URL = '/admin';

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const response: AxiosResponse<UsersResponse> = await api.get(
      `${BASE_URL}/users`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to fetch users',
      success: false
    };
  }
};
