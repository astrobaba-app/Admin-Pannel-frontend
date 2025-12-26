"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { colors } from "@/utils/colors";

import Input from "@/components/atoms/Input";

import Button from "@/components/atoms/Button";

import { useToast } from "@/contexts/ToastContext";

import { adminLogin, verify2FALogin } from "@/store/api/auth";

import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [twoFACode, setTwoFACode] = useState("");

  // Check if already logged in and redirect to dashboard
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");

      return;
    }

    try {
      setLoading(true);

      const response = await adminLogin({ email, password });

      if (response.requires2FA && response.tempToken) {
        setTempToken(response.tempToken);
        setRequires2FA(true);
        toast.success("Please enter your 2FA code");
      } else if (response.success && response.admin) {
        localStorage.setItem("admin_data", JSON.stringify(response.admin));

        toast.success("Login successful!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!twoFACode || twoFACode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);

      const response = await verify2FALogin({
        tempToken,
        code: twoFACode,
      });

      if (response.success && response.admin) {
        localStorage.setItem("admin_data", JSON.stringify(response.admin));

        toast.success("Login successful!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden p-4">
      {/* Background Image/Pattern */}

      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url('/images/bg.jpg')",

            backgroundSize: "cover",

            backgroundPosition: "center",

            opacity: 0.5,
          }}
        />

        {/* White/light overlay with blur effect */}

        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      </div>

      {/* Login Card Container - Single element centered in the screen */}

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo and Text (Moved outside the white card but still grouped) */}

        <div className="flex flex-col items-center mb-10">
          <Image
            src="/images/logo.png"
            alt="Graho Logo"
            width={100}
            height={100}
            className="mb-2"
          />

          <span
            className="text-3xl font-bold tracking-wide"
            style={{ color: colors.primeYellow }}
          >
            Graho
          </span>

          <p className="text-gray-700 text-sm italic mt-0.5">
            Grah Disha, Jeevan Disha
          </p>
        </div>

        {/* The White Login Card */}

        <div className="bg-white rounded-2xl shadow-2xl w-full p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Admin Login
          </h1>

          <p className="text-center mb-8 text-gray-500">
            {requires2FA ? "Enter your 2FA verification code" : "Sign in to access your dashboard"}
          </p>

          {!requires2FA ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="py-3"
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="py-3"
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                variant="custom"
                customColors={{
                  backgroundColor: colors.primeYellow,

                  textColor: colors.black,

                  hoverBackgroundColor: colors.creamyYellow,
                }}
              >
                Login
              </Button>

              {/* OR Divider */}

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>

                <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>

                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <Button
                fullWidth
                variant="outline"
                size="md"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                icon={<FcGoogle size={20} />}
              >
                Login with Google
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Enter 6-digit code from Google Authenticator
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={twoFACode.length !== 6}
                variant="custom"
                customColors={{
                  backgroundColor: colors.primeYellow,
                  textColor: colors.black,
                  hoverBackgroundColor: colors.creamyYellow,
                }}
              >
                Verify & Login
              </Button>

              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTempToken("");
                  setTwoFACode("");
                }}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
