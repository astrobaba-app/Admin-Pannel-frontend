import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { colors } from "@/utils/colors";

interface RejectModalProps {
  astrologerName: string;
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
}

export default function RejectModal({
  astrologerName,
  onClose,
  onReject,
}: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      return;
    }

    try {
      setLoading(true);
      await onReject(reason);
    } catch (error) {
      console.error("Rejection error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          disabled={loading}
        >
          <RxCross2 size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reject Astrologer
        </h2>

        <p className="text-gray-600 mb-4">
          Are you sure you want to reject <span className="font-semibold">{astrologerName}</span>?
        </p>

        {/* Reason Input */}
        <div className="mb-6">
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            placeholder="Please provide a reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
          />
          {!reason.trim() && (
            <p className="text-xs text-gray-500 mt-1">Reason is required</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors border border-gray-300 hover:bg-gray-50 cursor-pointer"
            style={{
              color: colors.black,
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.primeRed,
              color: colors.white,
            }}
            disabled={!reason.trim() || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Rejecting...
              </span>
            ) : (
              "Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
