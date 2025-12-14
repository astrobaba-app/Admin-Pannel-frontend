"use client";

import React, { useState } from "react";
import { colors } from "@/utils/colors";

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState("all");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
          Payments
        </h1>
        <p className="text-gray-600 mt-1">Manage and track all transactions</p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <input
          type="text"
          placeholder="Search by transaction ID or user..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        />
      </div>

      {/* Payments Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="rounded-lg p-6 shadow-md"
          style={{ backgroundColor: colors.white }}
        >
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold" style={{ color: colors.primeGreen }}>
            $125,000
          </p>
        </div>

        <div
          className="rounded-lg p-6 shadow-md"
          style={{ backgroundColor: colors.white }}
        >
          <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
          <p className="text-3xl font-bold" style={{ color: colors.primeYellow }}>
            $12,500
          </p>
        </div>

        <div
          className="rounded-lg p-6 shadow-md"
          style={{ backgroundColor: colors.white }}
        >
          <p className="text-sm text-gray-600 mb-1">Completed Transactions</p>
          <p className="text-3xl font-bold" style={{ color: colors.black }}>
            5,420
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div
        className="rounded-lg shadow-md overflow-hidden"
        style={{ backgroundColor: colors.white }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.offYellow }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Astrologer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Empty State */}
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Payment data will be displayed here
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Backend API integration for payments is pending.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
