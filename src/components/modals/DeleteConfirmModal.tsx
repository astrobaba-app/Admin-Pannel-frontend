import React from "react";
import { colors } from "@/utils/colors";
import { RxCross2 } from "react-icons/rx";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div
        className="relative rounded-lg max-w-md w-full shadow-2xl"
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: colors.primeRed + "20" }}
            >
              <FaExclamationTriangle size={24} style={{ color: colors.primeRed }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: colors.black }}>
                Delete Product
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            disabled={loading}
          >
            <RxCross2 size={20} color={colors.black} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold" style={{ color: colors.black }}>
              "{productName}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-600 mt-2">
            All product data, images, and related information will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:bg-gray-100 border border-gray-300"
            style={{ color: colors.black }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: colors.primeRed }}
          >
            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
