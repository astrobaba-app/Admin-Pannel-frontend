import Image from "next/image";

import Button from "@/components/atoms/Button"; // Adjust path as necessary

import Input from "@/components/atoms/Input"; // Adjust path as necessary
import { RxCross2 } from "react-icons/rx";

interface AstrologerDetailModalProps {
  name: string;

  email: string;

  phone: string;

  languages: string;

  skills: string;

  experience: number;

  bio: string;

  imageUrl: string | null;

  onClose: () => void;

  onApprove: (price: number) => void;

  pricePerMinute: number | string;

  onPriceChange: (price: number | string) => void;

  loading?: boolean;
}

export default function AstrologerDetailModal({
  name,

  email,

  phone,

  languages,

  skills,

  experience,

  bio,

  imageUrl,

  onClose,

  onApprove,

  pricePerMinute,

  onPriceChange,

  loading = false,
}: AstrologerDetailModalProps) {
  const handleApprove = () => {
    const price =
      typeof pricePerMinute === "string"
        ? parseFloat(pricePerMinute)
        : pricePerMinute;

    if (price && !isNaN(price)) {
      onApprove(price);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <RxCross2 size={24} />
        </button>

        <div className="flex space-x-6 border-b pb-4 mb-4">
          {/* Profile Image */}

          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full p-[3px] border-2 border-yellow-500 bg-gray-200 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  width={96}
                  height={96}
                  className="rounded-full w-full h-full object-cover"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Contact and Overview Info */}

          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-900">{name}</h3>

            <p className="text-gray-600 text-sm">{email}</p>

            <p className="text-gray-600 text-sm mt-0.5">{phone}</p>
          </div>
        </div>

        {/* Detailed Info */}

        <div className="space-y-3 mb-6">
          <p className="text-gray-900 font-semibold">
            Languages:{" "}
            <span className="font-normal text-gray-700">{languages}</span>
          </p>

          <p className="text-gray-900 font-semibold">
            Skills: <span className="font-normal text-gray-700">{skills}</span>
          </p>

          <p className="text-gray-900 font-semibold">
            Exp:{" "}
            <span className="font-normal text-gray-700">
              {experience} Years
            </span>
          </p>
        </div>

        {/* Bio */}

        <div className="mb-6">
          <p className="text-gray-800 leading-relaxed">{bio}</p>
        </div>

        {/* Price Input and Action Button */}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100">
          <div className="w-full sm:w-2/3">
            <Input
              label="Enter Price per minute"
              type="number"
              placeholder="e.g., 20"
              value={pricePerMinute}
              onChange={(e) => onPriceChange(e.target.value)}
              className="text-base py-3"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <Button
              fullWidth
              onClick={handleApprove}
              variant="custom"
              customColors={{
                backgroundColor: "#F0DF20",

                textColor: "#1F2937",

                hoverBackgroundColor: "#e5d41f",
              }}
              size="md"
              className="cursor-pointer"
              disabled={
                loading ||
                !pricePerMinute ||
                (typeof pricePerMinute === "string" &&
                  parseFloat(pricePerMinute) <= 0)
              }
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
                  Approving...
                </span>
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
