import Image from "next/image";
import { colors } from "@/utils/colors";

interface PendingApprovalCardProps {
  name: string;
  specialties: string[];
  languages: string[];
  experience: number;
  imageUrl: string | null;
  onClick?: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function PendingApprovalCard({
  name,
  specialties,
  languages,
  experience,
  imageUrl,
  onClick,
  onApprove,
  onReject,
}: PendingApprovalCardProps) {
  const displaySpecialties = Array.isArray(specialties)
    ? specialties.slice(0, 3).join(", ") + (specialties.length > 3 ? " ...." : "")
    : specialties;

  const displayLanguages = Array.isArray(languages)
    ? languages.join(", ")
    : languages;

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-4 mb-5 items-start">
        <div className="shrink-0">
          <div
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
          >
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
        <div className="grow pt-1">
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">
            {name}
          </h3>
          <p className="text-sm text-gray-700 mb-0.5">
            {displaySpecialties}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            {displayLanguages}
          </p>
          <p className="text-sm text-gray-700">
            Exp: {experience} years
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApprove();
          }}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
          style={{
            backgroundColor: colors.primeYellow,
            color: colors.black,
          }}
        >
          Approve
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReject();
          }}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
          style={{
            backgroundColor: colors.primeRed,
            color: colors.white,
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}