import React from "react";
import { colors } from "@/utils/colors";

export default function ProductSkeleton() {
  return (
    <div
      className="rounded-lg shadow-md overflow-hidden"
      style={{ backgroundColor: colors.white }}
    >
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
        
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
}
