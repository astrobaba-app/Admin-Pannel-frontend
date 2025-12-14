import api from './index';
import { AxiosResponse } from 'axios';

// Astrologer Interfaces
export interface Astrologer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo: string | null;
  dateOfBirth: string;
  skills: string[];
  languages: string[];
  yearsOfExperience: number;
  bio: string;
  pricePerMinute: string;
  isApproved: boolean;
  isActive: boolean;
  isOnline: boolean;
  rating: string;
  totalConsultations: number;
  availability: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AstrologersResponse {
  success: boolean;
  astrologers: Astrologer[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApproveRequest {
  pricePerMinute: number;
}

export interface ApproveResponse {
  success: boolean;
  message: string;
  astrologer?: Astrologer;
}

export interface RejectResponse {
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
 * Get all astrologers
 */
export const getAllAstrologers = async (): Promise<AstrologersResponse> => {
  try {
    const response: AxiosResponse<AstrologersResponse> = await api.get(
      `${BASE_URL}/astrologers`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to fetch astrologers',
      success: false
    };
  }
};

/**
 * Get pending astrologers
 */
export const getPendingAstrologers = async (): Promise<AstrologersResponse> => {
  try {
    const response: AxiosResponse<AstrologersResponse> = await api.get(
      `${BASE_URL}/astrologers/pending`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to fetch pending astrologers',
      success: false
    };
  }
};

/**
 * Approve astrologer
 */
export const approveAstrologer = async (
  astrologerId: string,
  data: ApproveRequest
): Promise<ApproveResponse> => {
  try {
    const response: AxiosResponse<ApproveResponse> = await api.put(
      `${BASE_URL}/astrologers/${astrologerId}/approve`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to approve astrologer',
      success: false
    };
  }
};

export interface RejectRequest {
  reason: string;
}

/**
 * Reject astrologer
 */
export const rejectAstrologer = async (
  astrologerId: string,
  data: RejectRequest
): Promise<RejectResponse> => {
  try {
    const response: AxiosResponse<RejectResponse> = await api.put(
      `${BASE_URL}/astrologers/${astrologerId}/reject`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to reject astrologer',
      success: false
    };
  }
};
