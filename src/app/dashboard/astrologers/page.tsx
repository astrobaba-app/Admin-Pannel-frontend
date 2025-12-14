"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import AstrologerCard from "@/components/cards/AstrologerCard";
import ViewOnlyModal from "@/components/modals/ViewOnlyModal";
import AstrologerCardSkeleton from "@/components/skeletons/AstrologerCardSkeleton";
import { getAllAstrologers } from "@/store/api/astrologer";
import { useToast } from "@/contexts/ToastContext";

export default function AstrologersPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [selectedAstrologer, setSelectedAstrologer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      const response = await getAllAstrologers();
      setAstrologers(response.astrologers);
    } catch (error: any) {
      console.error("Error fetching astrologers:", error);
      toast.error(error.message || "Failed to fetch astrologers");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (astrologer: any) => {
    setSelectedAstrologer(astrologer);
    setIsModalOpen(true);
  };

  const filteredAstrologers = astrologers.filter((astrologer) =>
    astrologer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
          Astrologers
        </h1>
        <p className="text-gray-600 mt-1">
          {loading ? "Loading..." : `${astrologers.length} active astrologers`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search astrologers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        />
      </div>

      {/* Astrologers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <AstrologerCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredAstrologers.length === 0 ? (
        <div
          className="rounded-lg p-12 text-center"
          style={{ backgroundColor: colors.white }}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No astrologers found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search query."
              : "No astrologers have been approved yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer) => (
            <div
              key={astrologer.id}
              onClick={() => handleCardClick(astrologer)}
              className="cursor-pointer"
            >
              <AstrologerCard
                name={astrologer.fullName}
                specialties={astrologer.skills || []}
                languages={astrologer.languages || []}
                experience={astrologer.yearsOfExperience || 0}
                imageUrl={astrologer.photo}
                showActions={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Astrologer Detail Modal */}
      {isModalOpen && selectedAstrologer && (
        <ViewOnlyModal
          name={selectedAstrologer.fullName}
          email={selectedAstrologer.email}
          phone={selectedAstrologer.phoneNumber}
          languages={Array.isArray(selectedAstrologer.languages) ? selectedAstrologer.languages.join(", ") : selectedAstrologer.languages}
          skills={Array.isArray(selectedAstrologer.skills) ? selectedAstrologer.skills.join(", ") : selectedAstrologer.skills}
          experience={selectedAstrologer.yearsOfExperience}
          bio={selectedAstrologer.bio}
          imageUrl={selectedAstrologer.photo || "/images/default-avatar.png"}
          pricePerMinute={selectedAstrologer.pricePerMinute}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
