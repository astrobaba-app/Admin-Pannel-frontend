import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { colors } from "@/utils/colors";

interface ViewOnlyModalProps {
  name: string;
  email: string;
  phone: string;
  languages: string;
  skills: string;
  experience: number;
  bio: string;
  imageUrl: string | null;
  pricePerMinute?: string | number;
  onClose: () => void;
}

export default function ViewOnlyModal({
  name,
  email,
  phone,
  languages,
  skills,
  experience,
  bio,
  imageUrl,
  pricePerMinute,
  onClose,
}: ViewOnlyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <RxCross2 size={24} />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 border-b pb-6 mb-6">
          {/* Profile Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div 
              className="w-32 h-32 rounded-full p-1 bg-gray-200 flex items-center justify-center overflow-hidden"
              style={{ 
                background: imageUrl ? `linear-gradient(135deg, ${colors.primeYellow} 0%, ${colors.creamyYellow} 100%)` : '#E5E7EB'
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  width={128}
                  height={128}
                  className="rounded-full w-full h-full object-cover"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Contact and Overview Info */}
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{name}</h2>
            <div className="space-y-1.5 text-gray-600">
              <p className="text-sm flex items-center justify-center md:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </p>
              <p className="text-sm flex items-center justify-center md:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </p>
              {pricePerMinute && (
                <p className="text-sm flex items-center justify-center md:justify-start gap-2 font-semibold" style={{ color: colors.primeGreen }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ₹{pricePerMinute}/min
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-5 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Languages
            </h3>
            <p className="text-gray-800">{languages}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Skills & Expertise
            </h3>
            <p className="text-gray-800">{skills}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Experience
            </h3>
            <p className="text-gray-800">{experience} Years</p>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-5 border-t">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            About
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        </div>

        {/* Close Button at Bottom */}
        <div className="mt-6 pt-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.primeYellow,
              color: colors.black,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.creamyYellow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primeYellow;
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
