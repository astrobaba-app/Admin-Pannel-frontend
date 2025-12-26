"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/colors";
import { createProduct, updateProduct } from "@/store/api/store";
import { useToast } from "@/contexts/ToastContext";
import { RxCross2 } from "react-icons/rx";

interface ProductModalProps {
  product?: any;
  isEditMode?: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CATEGORIES = [
  { value: "gemstone", label: "Gemstone" },
  { value: "rudraksha", label: "Rudraksha" },
  { value: "yantra", label: "Yantra" },
  { value: "idol", label: "Idol" },
  { value: "book", label: "Book" },
  { value: "report", label: "Report" },
  { value: "puja_samagri", label: "Puja Samagri" },
  { value: "bracelet", label: "Bracelet" },
  { value: "pendant", label: "Pendant" },
  { value: "other", label: "Other" },
];

const PRODUCT_TYPES = [
  { value: "physical", label: "Physical Product" },
  { value: "digital", label: "Digital Product" },
];

export default function ProductModal({
  product,
  isEditMode = false,
  onClose,
  onSave,
}: ProductModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    productType: "physical",
    stock: "",
    weight: "",
    dimensions: "",
    tags: "",
    isFeatured: false,
    digitalFileUrl: "",
    downloadLinkExpiry: "30",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        productName: product.productName || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        category: product.category || "",
        productType: product.productType || "physical",
        stock: product.stock || "",
        weight: product.weight || "",
        dimensions: product.dimensions || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
        isFeatured: product.isFeatured || false,
        digitalFileUrl: product.digitalFileUrl || "",
        downloadLinkExpiry: product.downloadLinkExpiry || "30",
      });
      if (product.images) {
        setImagePreviews(product.images);
      }
    }
  }, [product, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.productType === "digital" && !formData.digitalFileUrl) {
      toast.error("Digital products must have a file URL");
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          const tagsArray = (formData[key as keyof typeof formData] as string).split(",").map(t => t.trim());
          submitFormData.append(key, JSON.stringify(tagsArray));
        } else if (key === "isFeatured") {
          submitFormData.append(key, (formData[key as keyof typeof formData] as boolean).toString());
        } else {
          submitFormData.append(key, String(formData[key as keyof typeof formData]));
        }
      });

      images.forEach((image) => {
        submitFormData.append("images", image);
      });

      if (isEditMode && product) {
        await updateProduct(product.id, submitFormData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(submitFormData);
        toast.success("Product created successfully");
      }

      onSave();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div
        className="relative rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <RxCross2 size={24} color={colors.black} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": colors.primeYellow } as any}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Brief description (for listings)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": colors.primeYellow } as any}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter full product description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{ "--tw-ring-color": colors.primeYellow } as any}
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Discount Price (₹)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              />
            </div>
          </div>

          {/* Category & Type Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Product Type *
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              >
                {PRODUCT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock (only for physical) */}
          {formData.productType === "physical" && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              />
            </div>
          )}

          {/* Digital File URL (only for digital) */}
          {formData.productType === "digital" && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Digital File URL *
              </label>
              <input
                type="url"
                name="digitalFileUrl"
                value={formData.digitalFileUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              />
            </div>
          )}

          {/* Weight & Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Weight (kg)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="e.g., 10x10x5 cm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.primeYellow } as any}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., popular, bestseller, trending"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": colors.primeYellow } as any}
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: colors.primeYellow }}
            />
            <label className="text-sm font-medium cursor-pointer" style={{ color: colors.black }}>
              Mark as Featured
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
              Product Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": colors.primeYellow } as any}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all"
                    >
                      <RxCross2 size={20} color="white" className="opacity-0 group-hover:opacity-100" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:bg-gray-100"
              style={{ color: colors.black }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: colors.primeYellow, color: colors.black }}
            >
              {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
