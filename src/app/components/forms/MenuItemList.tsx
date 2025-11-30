/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useAlert } from "../../../lib/hooks/useAlert";
import { MenuItemDetails } from "../../../types";
import { menuApi } from "../../../lib/api/menuApi";
import ImagePreviewModal from "./ImagePreviewModal";

interface MenuItemListProps {
  onEditItem: (item: MenuItemDetails) => void;
  searchTerm: string;
}

export default function MenuItemList({
  onEditItem,
  searchTerm,
}: MenuItemListProps) {
  const { success, error } = useAlert();
  const [items, setItems] = useState<MenuItemDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedItemImages, setSelectedItemImages] = useState<string[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      // Use the menuApi to fetch items
      const menuResponse = await menuApi.fetchMenu();
      setItems(menuResponse.items);

      // Debug: Check image data structure
      console.log("Menu items loaded:", menuResponse.items);
      menuResponse.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          name: item.name,
          image: item.image,
          images: item.images,
          hasImage: !!item.image,
          hasImagesArray: !!(item.images && item.images.length > 0),
        });
      });
    } catch (err) {
      console.error("Failed to load menu items:", err);
      error("Failed to load menu items", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      // Simulate API call - in a real app, you'd call menuApi.deleteMenuItem(itemId)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      success("Menu item deleted successfully", "Deleted");
    } catch (err) {
      console.error("Failed to delete menu item:", err);
      error("Failed to delete menu item", "Error");
    }
  };

  const handleToggleAvailability = async (
    itemId: string,
    currentStatus: boolean
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isAvailable: !currentStatus } : item
        )
      );
      success(
        `Item ${currentStatus ? "disabled" : "enabled"} successfully`,
        "Status Updated"
      );
    } catch (err) {
      console.error("Failed to update item status:", err);
      error("Failed to update item status", "Error");
    }
  };

  const handleImagePreview = (item: MenuItemDetails, index: number = 0) => {
    // Use images array if available, otherwise use single image
    const imagesToShow =
      item.images && item.images.length > 0
        ? item.images
        : item.image
        ? [item.image]
        : ["/images/placeholder-food.jpg"]; // Fallback placeholder

    console.log("Preview images for", item.name, ":", imagesToShow);
    setSelectedItemImages(imagesToShow);
    setSelectedImageIndex(index);
    setShowImagePreview(true);
  };

  // Get the primary image for display
  const getPrimaryImage = (item: MenuItemDetails) => {
    // Check images array first
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    // Then check single image property
    if (item.image) {
      return item.image;
    }
    // Fallback placeholder
    return "/images/placeholder-food.jpg";
  };

  // Get all images for a menu item
  const getAllImages = (item: MenuItemDetails) => {
    if (item.images && item.images.length > 0) {
      return item.images;
    }
    if (item.image) {
      return [item.image];
    }
    return ["/images/placeholder-food.jpg"];
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getSpiceLevel = (level: number) => {
    const spices = ["🌱", "🌶️", "🔥", "💀"];
    return spices[level] || spices[0];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="h-20 bg-gray-300 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold theme-accent">
              {items.length}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {items.filter((item) => item.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {items.filter((item) => item.chefRecommendation).length}
            </div>
            <div className="text-sm text-gray-600">Chef's Picks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {Array.from(new Set(items.map((item) => item.category))).length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "No menu items found" : "No menu items yet"}
            </h3>
            <p className="opacity-80">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by adding your first menu item"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const allImages = getAllImages(item);
              const primaryImage = getPrimaryImage(item);
              const hasMultipleImages = allImages.length > 1;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Image with Preview */}
                      <div className="relative">
                        <button
                          onClick={() => handleImagePreview(item)}
                          className="w-20 h-20 rounded-lg overflow-hidden hover:opacity-90 transition-opacity group bg-gray-100 border"
                        >
                          <img
                            src={primaryImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src =
                                "/images/placeholder-food.jpg";
                              e.currentTarget.alt = "Image not available";
                            }}
                          />
                          {/* Preview Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0a3 3 0 100 6v0a3 3 0 100-6z"
                              />
                            </svg>
                          </div>
                        </button>

                        {/* Multiple Images Indicator */}
                        {hasMultipleImages && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            +{allImages.length - 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {item.name}
                          </h3>
                          <span className="text-sm px-2 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                            {item.category}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>${item.price.toFixed(2)}</span>
                          <span>•</span>
                          <span>{item.preparationTime} mins</span>
                          <span>•</span>
                          <span>⭐ {item.rating}</span>
                          <span>•</span>
                          <span>{getSpiceLevel(item.spiceLevel)}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          item.isAvailable
                        )}`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>

                      {/* Special Badges */}
                      <div className="flex space-x-1">
                        {item.chefRecommendation && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            👨‍🍳
                          </span>
                        )}
                        {item.seasonal && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            🍂
                          </span>
                        )}
                        {item.deals && item.deals.length > 0 && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            🎁
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Images Preview (if available) */}
                  {hasMultipleImages && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Additional Images:
                      </p>
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {allImages.slice(0, 5).map((image, index) => (
                          <button
                            key={index}
                            onClick={() => handleImagePreview(item, index)}
                            className={`flex-shrink-0 w-12 h-12 rounded border overflow-hidden hover:opacity-90 transition-opacity bg-gray-100 ${
                              index === 0
                                ? "border-2 border-green-500"
                                : "border border-gray-300"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${item.name} view ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/placeholder-food.jpg";
                              }}
                            />
                          </button>
                        ))}
                        {allImages.length > 5 && (
                          <button
                            onClick={() => handleImagePreview(item)}
                            className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-200 transition-colors"
                          >
                            +{allImages.length - 5}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() =>
                        handleToggleAvailability(item.id, item.isAvailable)
                      }
                      className={`px-3 py-1 text-sm rounded border transition-colors ${
                        item.isAvailable
                          ? "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                          : "border-green-500 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {item.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => onEditItem(item)}
                      className="px-3 py-1 text-sm bg-theme-accent text-white rounded hover:opacity-90 transition-opacity"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        images={selectedItemImages}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        onRemoveImage={() => {}} // Empty function since we don't allow removal from list view
      />
    </>
  );
}
