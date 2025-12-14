"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { colors } from "@/utils/colors";

import Input from "@/components/atoms/Input";

import Button from "@/components/atoms/Button";

import { useToast } from "@/contexts/ToastContext";

import { adminLogin } from "@/store/api/auth";

import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  
  const [mounted, setMounted] = useState(false);

  // Check if already logged in
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);
  
  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
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

      if (response.success && response.admin) {
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
            Sign in to access your dashboard
          </p>

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
        </div>
      </div>
    </div>
  );
}
