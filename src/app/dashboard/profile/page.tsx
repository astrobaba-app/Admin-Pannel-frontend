"use client";

import React, { useState } from "react";
import { colors } from "@/utils/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function ProfilePage() {
  const { admin } = useAuth();
  const toast = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleToggleTwoFactor = () => {
    // TODO: Implement two-factor authentication toggle
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      twoFactorEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled"
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
          Profile
        </h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-3xl">
        {/* Profile Information */}
        <div
          className="rounded-lg p-6 shadow-md mb-6"
          style={{ backgroundColor: colors.white }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={admin?.fullName || "Admin User"}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={admin?.email || "admin@example.com"}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={admin?.role || "admin"}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 capitalize"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div
          className="rounded-lg p-6 shadow-md"
          style={{ backgroundColor: colors.white }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
            Security Settings
          </h2>

          <div className="space-y-4">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium" style={{ color: colors.black }}>
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={handleToggleTwoFactor}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                style={{
                  backgroundColor: twoFactorEnabled
                    ? colors.primeGreen
                    : colors.gray,
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Change Password */}
            <div className="pt-4">
              <button
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.primeYellow,
                  color: colors.black,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.offYellow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primeYellow;
                }}
                onClick={() => toast.info("Change password feature coming soon")}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
