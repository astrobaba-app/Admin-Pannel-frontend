"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import PendingApprovalCard from "@/components/cards/PendingApprovalCard";
import AstrologerDetailModal from "@/components/modals/AstrologerDetailModal";
import RejectModal from "@/components/modals/RejectModal";
import PendingApprovalCardSkeleton from "@/components/skeletons/PendingApprovalCardSkeleton";
import { getPendingAstrologers, approveAstrologer, rejectAstrologer } from "@/store/api/astrologer";
import { useToast } from "@/contexts/ToastContext";

export default function PendingApprovalsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [selectedAstrologer, setSelectedAstrologer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [astrologerToReject, setAstrologerToReject] = useState<any>(null);
  const [pricePerMinute, setPricePerMinute] = useState<number | string>("");

  useEffect(() => {
    fetchPendingAstrologers();
  }, []);

  const fetchPendingAstrologers = async () => {
    try {
      setLoading(true);
      const response = await getPendingAstrologers();
      setAstrologers(response.astrologers);
    } catch (error: any) {
      console.error("Error fetching pending astrologers:", error);
      toast.error(error.message || "Failed to fetch pending astrologers");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (astrologer: any) => {
    setSelectedAstrologer(astrologer);
    setPricePerMinute("");
    setIsModalOpen(true);
  };

  const handleApprove = async (price: number) => {
    if (!selectedAstrologer) return;
    try {
      setApproveLoading(true);
      await approveAstrologer(selectedAstrologer.id, { pricePerMinute: price });
      toast.success("Astrologer approved successfully");
      setIsModalOpen(false);
      fetchPendingAstrologers(); // Refresh list
    } catch (error: any) {
      console.error("Error approving astrologer:", error);
      toast.error(error.message || "Failed to approve astrologer");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleRejectClick = (astrologer: any) => {
    setAstrologerToReject(astrologer);
    setIsRejectModalOpen(true);
  };

  const handleReject = async (reason: string) => {
    if (!astrologerToReject) return;
    
    try {
      await rejectAstrologer(astrologerToReject.id, { reason });
      toast.success("Astrologer rejected successfully");
      setIsRejectModalOpen(false);
      setAstrologerToReject(null);
      fetchPendingAstrologers(); // Refresh list
    } catch (error: any) {
      console.error("Error rejecting astrologer:", error);
      toast.error(error.message || "Failed to reject astrologer");
      throw error; // Re-throw to let RejectModal handle loading state
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
          Pending Approvals
        </h1>
        <p className="text-gray-600 mt-1">
          {loading ? "Loading..." : `${astrologers.length} astrologers awaiting approval`}
        </p>
      </div>

      {/* Astrologers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PendingApprovalCardSkeleton key={index} />
          ))}
        </div>
      ) : astrologers.length === 0 ? (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No pending approvals
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All astrologer applications have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astrologers.map((astrologer) => (
            <PendingApprovalCard
              key={astrologer.id}
              name={astrologer.fullName}
              specialties={astrologer.skills || []}
              languages={astrologer.languages || []}
              experience={astrologer.yearsOfExperience || 0}
              imageUrl={astrologer.photo}
              onClick={() => handleCardClick(astrologer)}
              onApprove={() => handleCardClick(astrologer)}
              onReject={() => handleRejectClick(astrologer)}
            />
          ))}
        </div>
      )}

      {/* Astrologer Detail Modal */}
      {isModalOpen && selectedAstrologer && (
        <AstrologerDetailModal
          name={selectedAstrologer.fullName}
          email={selectedAstrologer.email}
          phone={selectedAstrologer.phoneNumber}
          languages={Array.isArray(selectedAstrologer.languages) ? selectedAstrologer.languages.join(", ") : selectedAstrologer.languages}
          skills={Array.isArray(selectedAstrologer.skills) ? selectedAstrologer.skills.join(", ") : selectedAstrologer.skills}
          experience={selectedAstrologer.yearsOfExperience}
          bio={selectedAstrologer.bio}
          imageUrl={selectedAstrologer.photo}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          pricePerMinute={pricePerMinute}
          onPriceChange={setPricePerMinute}
          loading={approveLoading}
        />
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && astrologerToReject && (
        <RejectModal
          astrologerName={astrologerToReject.fullName}
          onClose={() => {
            setIsRejectModalOpen(false);
            setAstrologerToReject(null);
          }}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
