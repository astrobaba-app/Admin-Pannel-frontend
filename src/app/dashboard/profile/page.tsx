"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
} from "@/store/api/admin";
import { FaEdit, FaSave, FaTimes, FaLock, FaQrcode, FaShieldAlt } from "react-icons/fa";

export default function ProfilePage() {
  const { admin, setAdmin } = useAuth();
  const toast = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // 2FA States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [disable2FACode, setDisable2FACode] = useState("");

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.fullName || admin.name || "",
        email: admin.email || "",
      });
      setTwoFactorEnabled(admin.twoFactorEnabled || false);
    }
  }, [admin]);

  // Fetch fresh profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getAdminProfile();
        if (response.admin) {
          setProfileData({
            name: response.admin.name || "",
            email: response.admin.email || "",
          });
          setTwoFactorEnabled(response.admin.twoFactorEnabled || false);
          
          // Update admin context
          if (setAdmin && admin) {
            setAdmin({
              ...admin,
              twoFactorEnabled: response.admin.twoFactorEnabled,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: admin?.fullName || admin?.name || "",
      email: admin?.email || "",
    });
  };

  const handleProfileSave = async () => {
    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!profileData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const response = await updateAdminProfile(profileData);
      toast.success(response.message || "Profile updated successfully");
      
      // Update admin context
      if (setAdmin && admin) {
        setAdmin({
          ...admin,
          name: profileData.name,
          fullName: profileData.name,
          email: profileData.email,
        });
      }
      
      setIsEditingProfile(false);
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(response.message || "Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      const response = await enableTwoFactor();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setIsSettingUp2FA(true);
      toast.success("Scan the QR code with Google Authenticator");
    } catch (error: any) {
      console.error("Enable 2FA error:", error);
      toast.error(error.message || "Failed to enable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyTwoFactor(verificationCode);
      toast.success(response.message || "2FA enabled successfully");
      setTwoFactorEnabled(true);
      setIsSettingUp2FA(false);
      setVerificationCode("");
      setQrCode("");
      setSecret("");
      
      // Update admin context
      if (setAdmin && admin) {
        setAdmin({
          ...admin,
          twoFactorEnabled: true,
        });
      }
    } catch (error: any) {
      console.error("Verify 2FA error:", error);
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disable2FACode || disable2FACode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await disableTwoFactor(disable2FACode);
      toast.success(response.message || "2FA disabled successfully");
      setTwoFactorEnabled(false);
      setIsDisabling2FA(false);
      setDisable2FACode("");
      
      // Update admin context
      if (setAdmin && admin) {
        setAdmin({
          ...admin,
          twoFactorEnabled: false,
        });
      }
    } catch (error: any) {
      console.error("Disable 2FA error:", error);
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold" style={{ color: colors.black }}>
              Profile Information
            </h2>
            {!isEditingProfile ? (
              <button
                onClick={handleProfileEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: colors.primeYellow }}
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: colors.primeYellow }}
                >
                  <FaSave />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleProfileCancel}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                disabled={!isEditingProfile || loading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 ${
                  isEditingProfile
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    : "bg-gray-50"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                disabled={!isEditingProfile || loading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 ${
                  isEditingProfile
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    : "bg-gray-50"
                }`}
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
            {/* Change Password */}
            <div className="py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-medium" style={{ color: colors.black }}>
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your password regularly to keep your account secure
                  </p>
                </div>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    <FaLock />
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: colors.primeYellow }}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Two-Factor Authentication */}
            <div className="py-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: colors.black }}>
                    <FaShieldAlt className="text-green-600" />
                    Google Authenticator (2FA)
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Add an extra layer of security to your account
                  </p>
                  {twoFactorEnabled && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      ✓ Enabled
                    </span>
                  )}
                </div>
                {!twoFactorEnabled && !isSettingUp2FA && (
                  <button
                    onClick={handleEnable2FA}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    <FaQrcode />
                    Enable 2FA
                  </button>
                )}
                {twoFactorEnabled && !isDisabling2FA && (
                  <button
                    onClick={() => setIsDisabling2FA(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Disable 2FA
                  </button>
                )}
              </div>

              {/* Setup 2FA Flow */}
              {isSettingUp2FA && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Scan QR Code</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Open Google Authenticator app and scan this QR code
                    </p>
                    {qrCode && (
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="mx-auto w-48 h-48 border-2 border-gray-300 rounded"
                      />
                    )}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                      <code className="text-sm bg-white px-3 py-1 rounded border">
                        {secret}
                      </code>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter 6-digit verification code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleVerify2FA}
                      disabled={loading || verificationCode.length !== 6}
                      className="flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: colors.primeYellow }}
                    >
                      {loading ? "Verifying..." : "Verify & Enable"}
                    </button>
                    <button
                      onClick={() => {
                        setIsSettingUp2FA(false);
                        setVerificationCode("");
                        setQrCode("");
                        setSecret("");
                      }}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Disable 2FA Flow */}
              {isDisabling2FA && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Disable Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your current 6-digit code from Google Authenticator to disable 2FA
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={disable2FACode}
                      onChange={(e) => setDisable2FACode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDisable2FA}
                      disabled={loading || disable2FACode.length !== 6}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Disabling..." : "Disable 2FA"}
                    </button>
                    <button
                      onClick={() => {
                        setIsDisabling2FA(false);
                        setDisable2FACode("");
                      }}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
