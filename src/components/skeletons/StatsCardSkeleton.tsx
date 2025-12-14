import React from "react";

export default function StatsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
