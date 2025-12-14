"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import StatsCardSkeleton from "@/components/skeletons/StatsCardSkeleton";
import { getDashboardStats } from "@/store/api/dashboard";
import { useToast } from "@/contexts/ToastContext";

interface DashboardStats {
  totalAstrologers: number;
  approvedAstrologers: number;
  pendingApprovals: number;
  activeUsers: number;
  totalUsers: number;
}

const StatsCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <div
      className="rounded-lg p-6 shadow-md flex items-center justify-between"
      style={{ backgroundColor: colors.white, borderLeft: `4px solid ${color}` }}
    >
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold" style={{ color: colors.black }}>
          {value}
        </p>
      </div>
      <div
        className="p-4 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAstrologers: 0,
    approvedAstrologers: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      toast.error(error.message || "Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome to Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Astrologers"
              value={stats.totalAstrologers}
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke={colors.primeYellow}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              color={colors.primeYellow}
            />

            <StatsCard
              title="Approved Astrologers"
              value={stats.approvedAstrologers}
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke={colors.primeGreen}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color={colors.primeGreen}
            />

            <StatsCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke={colors.primeRed}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color={colors.primeRed}
            />

            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="#3B82F6"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              color="#3B82F6"
            />

            <StatsCard
              title="Active Users"
              value={stats.activeUsers}
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke={colors.primeGreen}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              color={colors.primeGreen}
            />
          </>
        )}
      </div>

      {/* Chart Placeholder */}
      <div
        className="rounded-lg p-6 shadow-md"
        style={{ backgroundColor: colors.white }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
          Revenue vs Astrologer Costs
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Chart will be integrated here</p>
        </div>
      </div>
    </div>
  );
}
