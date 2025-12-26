"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { colors } from "@/utils/colors";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaHome,
  FaCheckCircle,
  FaUsers,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
  FaStore,
  FaShoppingCart,
  FaHeadset,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import router from "next/router";

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const menuItems = [
  { icon: FaHome, label: "Dashboard", href: "/dashboard" },
  {
    icon: FaCheckCircle,
    label: "Pending Approvals",
    href: "/dashboard/pending-approvals",
  },
  { icon: FaUsers, label: "Astrologers", href: "/dashboard/astrologers" },
  { icon: FaStore, label: "Store", href: "/dashboard/store" },
  { icon: FaShoppingCart, label: "Orders", href: "/dashboard/orders" },
  { icon: FaHeadset, label: "Support", href: "/dashboard/support" },
  { icon: FaMoneyBillWave, label: "Payments", href: "/dashboard/payments" },
];

export default function Sidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (isMobile && onClose) {
      onClose();
    }
    await logout();
    router.push("/login");
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: colors.offYellow }}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            unoptimized
          />

          <span
            className="text-3xl font-bold"
            style={{ color: colors.primeYellow }}
          >
            Graho
          </span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2">
            <RxCross2 size={24} color={colors.black} />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`flex items-center gap-4 px-6 py-4 rounded-lg mb-2 transition-all ${
                isActive ? "font-semibold" : ""
              }`}
              style={{
                backgroundColor: isActive ? colors.primeYellow : "transparent",
                color: colors.black,
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: colors.creamyYellow }}
      >
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-4 px-6 py-4 rounded-lg mb-2 transition-all"
          style={{
            backgroundColor:
              pathname === "/dashboard/profile"
                ? colors.primeYellow
                : "transparent",
            color: colors.black,
          }}
        >
          <FaUser size={20} />
          <span>My Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-4 px-6 py-4 rounded-lg w-full text-left transition-all hover:bg-gray-200"
          style={{ color: colors.black }}
        >
          <FaSignOutAlt size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
