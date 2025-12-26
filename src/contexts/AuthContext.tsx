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
  const router = useRouter();

  useEffect(() => {
    // Initialize admin state from localStorage
    const initializeAuth = () => {
      const token = localStorage.getItem("admin_token");
      const adminData = localStorage.getItem("admin_data");

      if (token && adminData) {
        try {
          const parsedAdmin = JSON.parse(adminData);
          setAdmin(parsedAdmin);
        } catch (error) {
          console.error("Failed to parse admin data:", error);
          localStorage.removeItem("admin_data");
          localStorage.removeItem("admin_token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAdmin(null);
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      router.push("/login");
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
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
