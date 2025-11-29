/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useAlert } from "../../../lib/hooks/useAlert";
import {
  MenuItemDetails,
  CustomizationOption,
  Deal,
  DietaryInfo,
} from "../../../types";
import ImagePreviewModal from "./ImagePreviewModal";

interface MenuItemFormProps {
  item?: MenuItemDetails | null;
  onSave: (item: MenuItemDetails) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

export default function MenuItemForm({
  item,
  onSave,
  onCancel,
  mode,
}: MenuItemFormProps) {
  const { success, error } = useAlert();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<MenuItemDetails>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    ingredients: [],
    isAvailable: true,
    preparationTime: 15,
    rating: 4.5,
    spiceLevel: 0,
    images: [],
    tags: [],
    chefRecommendation: false,
    seasonal: false,
    servingSize: "1 serving",
    allergens: [],
    customizationOptions: [],
    deals: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    },
    cookingInstructions: "",
    relatedItems: [],
    popularityScore: 50,
  });

  const categories = [
    "Pizza",
    "Burgers",
    "Pasta",
    "Salads",
    "Desserts",
    "Beverages",
    "Appetizers",
    "Sides",
  ];
  const spiceLevels = [
    { value: 0, label: "🌱 Mild" },
    { value: 1, label: "🌶️ Medium" },
    { value: 2, label: "🔥 Hot" },
    { value: 3, label: "💀 Extra Hot" },
  ];

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData(item);
    }
  }, [item, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof MenuItemDetails] as any),
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (
    field: string,
    value: string,
    operation: "add" | "remove" | "set"
  ) => {
    setFormData((prev) => {
      const currentArray =
        (prev[field as keyof MenuItemDetails] as string[]) || [];
      let newArray: string[];

      if (operation === "add") {
        newArray = [...currentArray, value];
      } else if (operation === "remove") {
        newArray = currentArray.filter((item) => item !== value);
      } else {
        newArray = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          error(`File "${file.name}" is not an image`, "Invalid File");
          continue;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          error(
            `File "${file.name}" is too large (max 10MB)`,
            "File Too Large"
          );
          continue;
        }

        // Simulate file upload - in real app, you would upload to your server
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create a blob URL for preview (in real app, this would be your CDN URL)
        const blobUrl = URL.createObjectURL(file);
        uploadedUrls.push(blobUrl);
      }

      if (uploadedUrls.length > 0) {
        // Add uploaded images to form data
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));

        success(
          `Successfully uploaded ${uploadedUrls.length} image(s)`,
          "Upload Complete"
        );
      }
    } catch (err) {
      error("Failed to upload images", "Upload Error");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrlAdd = (url: string) => {
    if (url.trim()) {
      // Basic URL validation
      try {
        new URL(url.trim());
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), url.trim()],
        }));
        success("Image URL added successfully", "URL Added");
      } catch {
        error("Please enter a valid URL", "Invalid URL");
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
    success("Image removed", "Image Removed");
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const images = [...(prev.images || [])];
      const [movedImage] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedImage);
      return {
        ...prev,
        images,
      };
    });
    success("Image order updated", "Order Updated");
  };

  const handleImagePreview = (index: number) => {
    setSelectedImageIndex(index);
    setShowImagePreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.category
      ) {
        error("Please fill in all required fields", "Validation Error");
        setLoading(false);
        return;
      }

      // Validate images
      if (!formData.images || formData.images.length === 0) {
        error("Please add at least one image", "Validation Error");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate ID for new items
      const itemData: MenuItemDetails = {
        ...(formData as MenuItemDetails),
        id: mode === "add" ? `item_${Date.now()}` : item?.id || "",
      };

      success(
        `Menu item ${mode === "add" ? "added" : "updated"} successfully!`,
        `${mode === "add" ? "Added" : "Updated"} Successfully`
      );

      onSave(itemData);
    } catch (err) {
      error("Failed to save menu item", "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold theme-accent mb-2">
            {mode === "add" ? "Add New Menu Item" : `Edit ${item?.name}`}
          </h2>
          <p className="opacity-80">
            {mode === "add"
              ? "Create a new menu item with all the necessary details"
              : "Update the menu item information"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
                placeholder="e.g., Margherita Pizza"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price || 0}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preparation Time (minutes) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.preparationTime || 15}
                onChange={(e) =>
                  handleInputChange("preparationTime", parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              placeholder="Describe the menu item in detail..."
              required
            />
          </div>

          {/* Image Management */}
          <div>
            <label className="block text-sm font-medium mb-2">Images *</label>

            {/* Upload Section */}
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                  className="hidden"
                />
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="relative theme-accent font-medium hover:opacity-80 disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload images"}
                    </button>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="Or enter image URL..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleImageUrlAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    handleImageUrlAdd(input.value);
                    input.value = "";
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Add URL
                </button>
              </div>

              {/* Image Preview Grid */}
              {formData.images && formData.images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      Image Previews ({formData.images.length} image
                      {formData.images.length !== 1 ? "s" : ""})
                    </p>
                    <button
                      type="button"
                      onClick={() => handleImagePreview(0)}
                      className="text-sm theme-accent hover:underline"
                    >
                      View All Images
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <button
                          type="button"
                          onClick={() => handleImagePreview(index)}
                          className="w-full h-24 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>

                        {/* Action Buttons - Visible on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove(index);
                            }}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100"
                            title="Remove image"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          {index > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageReorder(index, index - 1);
                              }}
                              className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform scale-90 group-hover:scale-100"
                              title="Move left"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                          )}

                          {index < formData.images!.length - 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageReorder(index, index + 1);
                              }}
                              className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform scale-90 group-hover:scale-100"
                              title="Move right"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Main Image Badge */}
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                            Main
                          </div>
                        )}

                        {/* Preview Icon */}
                        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    First image will be used as the main display image. Click on
                    images to preview, hover to see actions.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Ingredients
            </label>
            <textarea
              value={formData.ingredients?.join(", ") || ""}
              onChange={(e) =>
                handleArrayChange("ingredients", e.target.value, "set")
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              placeholder="Enter ingredients separated by commas..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate ingredients with commas
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags?.join(", ") || ""}
              onChange={(e) => handleArrayChange("tags", e.target.value, "set")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              placeholder="e.g., Vegetarian, Spicy, Gluten-Free"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium mb-2">Allergens</label>
            <input
              type="text"
              value={formData.allergens?.join(", ") || ""}
              onChange={(e) =>
                handleArrayChange("allergens", e.target.value, "set")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              placeholder="e.g., Gluten, Dairy, Nuts"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate allergens with commas
            </p>
          </div>

          {/* Spice Level & Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Spice Level
              </label>
              <select
                value={formData.spiceLevel || 0}
                onChange={(e) =>
                  handleInputChange("spiceLevel", parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              >
                {spiceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.chefRecommendation || false}
                  onChange={(e) =>
                    handleInputChange("chefRecommendation", e.target.checked)
                  }
                  className="rounded text-theme-accent focus:ring-theme-accent"
                />
                <span className="text-sm font-medium">
                  Chef's Recommendation
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.seasonal || false}
                  onChange={(e) =>
                    handleInputChange("seasonal", e.target.checked)
                  }
                  className="rounded text-theme-accent focus:ring-theme-accent"
                />
                <span className="text-sm font-medium">Seasonal Item</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isAvailable || false}
                onChange={(e) =>
                  handleInputChange("isAvailable", e.target.checked)
                }
                className="rounded text-theme-accent focus:ring-theme-accent"
              />
              <span className="text-sm font-medium">Available for Order</span>
            </label>
          </div>

          {/* Serving Size */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Serving Size
            </label>
            <input
              type="text"
              value={formData.servingSize || ""}
              onChange={(e) => handleInputChange("servingSize", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              placeholder="e.g., 12-inch pizza (serves 2-3)"
            />
          </div>

          {/* Cooking Instructions */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cooking Instructions
            </label>
            <textarea
              value={formData.cookingInstructions || ""}
              onChange={(e) =>
                handleInputChange("cookingInstructions", e.target.value)
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
              placeholder="e.g., Stone-fired at 450°F for 90 seconds"
            />
          </div>

          {/* Nutritional Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.nutritionalInfo || {}).map(
                ([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="number"
                      value={value as number}
                      onChange={(e) =>
                        handleNestedChange(
                          "nutritionalInfo",
                          key,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-theme-accent"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-theme-accent text-white rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : mode === "add"
                ? "Add Item"
                : "Update Item"}
            </button>
          </div>
        </form>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        images={formData.images || []}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        onRemoveImage={handleImageRemove}
      />
    </>
  );
}
