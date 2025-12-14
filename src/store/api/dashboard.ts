import api from './index';
import { AxiosResponse } from 'axios';

export interface DashboardStats {
  totalAstrologers: number;
  approvedAstrologers: number;
  pendingApprovals: number;
  activeUsers: number;
  totalUsers: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}

const BASE_URL = '/admin';

/**
 * Get dashboard statistics
 * Aggregates data from multiple endpoints
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch all required data in parallel
    const [allAstrologersRes, pendingAstrologersRes, usersRes] = await Promise.all([
      api.get(`${BASE_URL}/astrologers`),
      api.get(`${BASE_URL}/astrologers/pending`),
      api.get(`${BASE_URL}/users`),
    ]);

    const stats: DashboardStats = {
      totalAstrologers: allAstrologersRes.data.pagination?.total || 0,
      approvedAstrologers: allAstrologersRes.data.astrologers?.filter((a: any) => a.isApproved).length || 0,
      pendingApprovals: pendingAstrologersRes.data.pagination?.total || 0,
      activeUsers: usersRes.data.users?.filter((u: any) => u.isActive !== false).length || 0,
      totalUsers: usersRes.data.pagination?.total || 0,
    };

    return stats;
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    throw error.response?.data || {
      message: 'Failed to fetch dashboard statistics',
      success: false
    };
  }
};
