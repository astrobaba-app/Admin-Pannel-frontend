import React from "react";

export default function PendingApprovalCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm animate-pulse">
      <div className="flex space-x-4">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gray-300"></div>
        </div>

        {/* Details Skeleton */}
        <div className="flex-grow min-w-0 space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-between space-x-3 mt-4 pt-3 border-t border-gray-100">
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  );
}
