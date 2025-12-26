"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        // No token found, redirect to login
        router.replace("/login");
        return;
      }
      
      // Token exists, user is authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authorized (during redirect)
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
