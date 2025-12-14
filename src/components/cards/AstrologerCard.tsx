import Image from "next/image";

import Button from "@/components/atoms/Button"; // Adjust this path if necessary

interface AstrologerCardProps {
  name: string;

  specialties: string;

  languages: string;

  experience: number;

  imageUrl: string | null;

  showActions: boolean;

  onApprove?: () => void;

  onReject?: () => void;
}

export default function AstrologerCard({
  name,

  specialties,

  languages,

  experience,

  imageUrl,

  showActions,

  onApprove,

  onReject,
}: AstrologerCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm">
      <div className="flex space-x-4">
        {/* Astrologer Image */}

        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full p-[3px] border-2 border-yellow-500 bg-gray-200 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={80}
                height={80}
                className="rounded-full w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>

        {/* Details */}

        <div className="flex-grow min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate">{name}</h3>

          <p className="text-sm text-gray-600 mt-1 truncate">{specialties}</p>

          <p className="text-sm text-gray-600 mt-2">{languages}</p>

          <p className="text-sm text-gray-600 mt-0.5">
            Exp. : {experience} years
          </p>
        </div>
      </div>

      {/* Action Buttons (Conditional) */}

      {showActions && (
        <div className="flex justify-between space-x-3 mt-4 pt-3 border-t border-gray-100">
          <Button
            fullWidth
            onClick={onApprove}
            variant="custom"
            customColors={{
              backgroundColor: "#F0DF20",

              textColor: "#1F2937",

              hoverBackgroundColor: "#e5d41f",
            }}
            size="md"
          >
            Approve
          </Button>

          <Button fullWidth onClick={onReject} variant="danger" size="md">
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
