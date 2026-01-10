import React from "react";
import { colors } from "@/utils/colors";

// Format category for display
const formatCategory = (category: string) => {
  const categoryMap: Record<string, string> = {
    gemstone: "Gemstone",
    rudraksha: "Rudraksha",
    yantra: "Yantra",
    idol: "Idol",
    book: "Book",
    report: "Report",
    puja_samagri: "Puja Samagri",
    bracelet: "Bracelet",
    pendant: "Pendant",
    other: "Other",
  };
  return categoryMap[category] || category;
};

interface ProductCardProps {
  product: any;
  onEdit?: () => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <div
      className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      style={{ backgroundColor: colors.white }}
      onClick={onEdit}
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Fallback placeholder */}
        <div className={`w-full h-full flex items-center justify-center bg-gray-100 absolute inset-0 ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: product.isActive ? colors.primeGreen : colors.primeRed }}
        >
          {product.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 md:line-clamp-1 mb-2">
          {product.productName}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-1 mb-3">
          {product.shortDescription || product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xl font-bold"
            style={{ color: colors.primeYellow }}
          >
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
          <span className="inline-block px-2 py-1 rounded" style={{ backgroundColor: colors.offYellow }}>
            {formatCategory(product.category)}
          </span>
          <span className="inline-block px-2 py-1 rounded" style={{ backgroundColor: colors.offYellow }}>
            {product.productType}
          </span>
        </div>

        {/* Stock */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-700">
            {product.productType === "digital" ? "Digital" : `Stock: ${product.stock || 0}`}
          </span>
          <span className="text-xs font-semibold" style={{ color: product.isFeatured ? colors.primeYellow : colors.gray }}>
            {product.isFeatured ? "⭐ Featured" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
