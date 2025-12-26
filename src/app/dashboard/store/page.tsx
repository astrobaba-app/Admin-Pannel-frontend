"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import ProductCard from "@/components/cards/ProductCard";
import ProductModal from "@/components/modals/ProductModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import { getAllProducts, deleteProduct, toggleProductStatus } from "@/store/api/store";
import { useToast } from "@/contexts/ToastContext";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

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

export default function StorePage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.products || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.products?.map((p: any) => p.category))] as string[];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      const response = await toggleProductStatus(productId);
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle product status");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  const handleProductSaved = () => {
    fetchProducts();
    handleModalClose();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
            Store Products
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? "Loading..." : `${products.length} products total`}
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: colors.primeYellow, color: colors.black }}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ "--tw-ring-color": colors.primeYellow } as any}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ "--tw-ring-color": colors.primeYellow } as any}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
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
              d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8 4 8-4v-10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search query."
              : "Get started by adding your first product."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <div className="flex-1">
                <ProductCard
                  product={product}
                  onEdit={() => handleEditProduct(product)}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(product.id);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: product.isActive ? colors.primeGreen + "20" : colors.primeRed + "20",
                    color: product.isActive ? colors.primeGreen : colors.primeRed,
                  }}
                >
                  {product.isActive ? <FaEye /> : <FaEyeSlash />}
                  {product.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProduct(product);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-80"
                  style={{ backgroundColor: colors.primeYellow, color: colors.black }}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProduct(product);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-80"
                  style={{ backgroundColor: colors.primeRed, color: colors.white }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          isEditMode={isEditMode}
          onClose={handleModalClose}
          onSave={handleProductSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        productName={productToDelete?.productName || ""}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
