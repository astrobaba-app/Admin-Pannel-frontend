"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogout } from "@/store/api/auth";

interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoggedIn: boolean;
  loading: boolean;
  setAdmin: (admin: Admin | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if admin is logged in
    const token = localStorage.getItem("admin_token");
    const adminData = localStorage.getItem("admin_data");

    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        console.error("Failed to parse admin data:", error);
        localStorage.removeItem("admin_data");
        localStorage.removeItem("admin_token");
      }
    }

    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      // Call backend logout API
      await adminLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state and storage
      setAdmin(null);
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      router.push("/login");
    }
  };

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoggedIn: !!admin,
        loading,
        setAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
