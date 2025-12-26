"use client";

import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { colors } from "@/utils/colors";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <Sidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 backdrop-blur-sm bg-black/30 "
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-64 bg-white">
                <Sidebar onClose={() => setSidebarOpen(false)} isMobile />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto" style={{ backgroundColor: colors.bg }}>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <RxHamburgerMenu size={24} color={colors.black} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold" style={{ color: colors.primeYellow }}>
                  Graho
                </span>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6">{children}</div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
