"use client";

import { useEffect } from "react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onRemoveImage: (index: number) => void;
}

export default function ImagePreviewModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  onRemoveImage,
}: ImagePreviewModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) {
            onIndexChange(currentIndex + 1);
          }
          break;
        case "Delete":
          if (images.length > 1) {
            const newIndex =
              currentIndex === images.length - 1
                ? currentIndex - 1
                : currentIndex;
            onRemoveImage(currentIndex);
            onIndexChange(newIndex);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    currentIndex,
    images.length,
    onClose,
    onIndexChange,
    onRemoveImage,
  ]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === images.length - 1;

  const handlePrevious = () => {
    if (!isFirstImage) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastImage) {
      onIndexChange(currentIndex + 1);
    }
  };

  const handleThumbnailClick = (index: number) => {
    onIndexChange(index);
  };

  const handleRemoveCurrent = () => {
    if (images.length > 1) {
      const newIndex = isLastImage ? currentIndex - 1 : currentIndex;
      onRemoveImage(currentIndex);
      onIndexChange(newIndex);
    } else {
      onRemoveImage(currentIndex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-6xl max-h-[90vh] w-full mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Remove Button */}
        <button
          onClick={handleRemoveCurrent}
          className="absolute top-4 left-4 z-10 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
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
          <span>Remove</span>
        </button>

        {/* Navigation Arrows */}
        {!isFirstImage && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
          >
            <svg
              className="w-6 h-6"
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

        {!isLastImage && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
          >
            <svg
              className="w-6 h-6"
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

        {/* Main Image - Added white background for better visibility */}
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-4 rounded-lg">
            {" "}
            {/* Added white background container */}
            <img
              src={currentImage}
              alt={`Preview ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600/cccccc/969696?text=Image+Not+Found";
                e.currentTarget.alt = "Image not available";
              }}
            />
          </div>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2 max-w-md overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all bg-white ${
                    index === currentIndex
                      ? "border-theme-accent ring-2 ring-theme-accent"
                      : "border-transparent hover:border-white"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/64/cccccc/969696?text=Img";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs rounded-lg p-3 space-y-1">
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-700 rounded">← →</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-700 rounded">Del</kbd>
            <span>Remove</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
