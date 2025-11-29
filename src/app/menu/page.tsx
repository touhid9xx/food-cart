/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  fetchMenu,
  setSelectedCategory,
  setSearchQuery,
  clearFilters,
} from "../../lib/slices/menuSlice";
import { addToCart } from "../../lib/slices/cartSlice";
import { useAlert } from "../../lib/hooks/useAlert";
import { useFlyingItems } from "../components/Animation/FlyingItemsProvider";
import { MenuItem } from "../../types";
import { getCartIconPosition } from "../components/CartIcon";

export default function Menu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success } = useAlert();
  const { flyItem } = useFlyingItems();
  const { items, categories, loading, error, selectedCategory, searchQuery } =
    useAppSelector((state) => state.menu);
  const [selectedImageIndex, setSelectedImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Ref for cart icon position
  const cartIconPosition = useRef({ x: 50, y: 50 });

  useEffect(() => {
    dispatch(fetchMenu());

    // Update cart icon position using the exported function
    const updateCartPosition = () => {
      const position = getCartIconPosition();
      cartIconPosition.current = position;
    };

    // Initial position
    setTimeout(updateCartPosition, 100);

    // Update on resize and scroll
    window.addEventListener("resize", updateCartPosition);
    window.addEventListener("scroll", updateCartPosition);
    return () => {
      window.removeEventListener("resize", updateCartPosition);
      window.removeEventListener("scroll", updateCartPosition);
    };
  }, [dispatch]);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      // Add tag search for enhanced API
      (item as any).tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleImageClick = (itemId: string, currentIndex: number) => {
    setSelectedImageIndex((prev) => ({
      ...prev,
      [itemId]: (currentIndex + 1) % 3,
    }));
  };

  const handleDotClick = (
    itemId: string,
    index: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => ({
      ...prev,
      [itemId]: index,
    }));
  };

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Get the clicked button position
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startPosition = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    };

    // Trigger flying animation
    flyItem(startPosition, cartIconPosition.current, item.image);

    // Add to cart after a small delay for better visual effect
    setTimeout(() => {
      dispatch(addToCart({ menuItem: item }));
      success(`Added ${item.name} to cart!`, "Cart Updated");
    }, 300);
  };

  const handleItemClick = (itemId: string) => {
    router.push(`/menu/${itemId}`);
  };

  const getSpiceLevel = (level: number) => {
    const spices = ["🌱 Mild", "🌶️ Medium", "🔥 Hot", "💀 Extra Hot"];
    return spices[level] || spices[0];
  };

  const getStarRating = (rating: number) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  // Helper function to check if item has deals
  const hasDeals = (item: MenuItem) => {
    return (item as any).deals?.length > 0;
  };

  // Helper function to check if it's chef recommendation
  const isChefRecommendation = (item: MenuItem) => {
    return (item as any).chefRecommendation;
  };

  // Helper function to check if it's seasonal
  const isSeasonal = (item: MenuItem) => {
    return (item as any).seasonal;
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 theme-accent neon-text">
              Our Menu
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="glassmorphism rounded-2xl p-6 backdrop-blur-lg border border-white/30 animate-pulse"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-500">
            <p>Error loading menu: {error}</p>
            <button
              onClick={() => dispatch(fetchMenu())}
              className="mt-4 px-6 py-2 bg-theme-accent text-white rounded-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 theme-accent neon-text animate-fade-in-up">
            Our Menu
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Discover our delicious selection of handcrafted dishes made with the
            finest ingredients
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glassmorphism rounded-2xl p-6 backdrop-blur-lg border border-white/30 neon-glow mb-8 animate-fade-in-up delay-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => dispatch(clearFilters())}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium transform hover:scale-105 ${
                  !selectedCategory
                    ? "theme-accent bg-white/40 backdrop-blur-sm text-white shadow-lg"
                    : "bg-white/80 dark:bg-white/20 text-gray-800 dark:text-white/90 hover:bg-white dark:hover:bg-white/30 hover:shadow-md"
                }`}
              >
                All
              </button>
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => dispatch(setSelectedCategory(category))}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium transform hover:scale-105 animate-fade-in-up delay-${
                    300 + index * 100
                  } ${
                    selectedCategory === category
                      ? "theme-accent bg-white/40 backdrop-blur-sm text-white shadow-lg"
                      : "bg-white/80 dark:bg-white/20 text-gray-800 dark:text-white/90 hover:bg-white dark:hover:bg-white/30 hover:shadow-md"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            const currentImageIndex = selectedImageIndex[item.id] || 0;
            const currentImage = item.images?.[currentImageIndex] || item.image;
            const isHovered = hoveredItem === item.id;
            const enhancedItem = item as any; // Cast to access enhanced properties

            return (
              <div
                key={item.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item.id)}
              >
                {/* Animated Card */}
                <div
                  className={`
                  glassmorphism rounded-2xl p-6 backdrop-blur-lg border border-white/30 
                  transition-all duration-500 ease-out transform
                  hover:scale-105 hover:shadow-2xl hover:neon-text
                  ${isHovered ? "translate-y-[-10px]" : "translate-y-0"}
                  animate-fade-in-up delay-${300 + index * 100}
                  relative overflow-hidden
                `}
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  {/* Enhanced Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {isChefRecommendation(item) && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                        👨‍🍳 Chef's Pick
                      </span>
                    )}
                    {isSeasonal(item) && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                        🍂 Seasonal
                      </span>
                    )}
                    {hasDeals(item) && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                        🎁 Deal
                      </span>
                    )}
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-theme-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 transform group-hover:scale-150"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300 transform group-hover:scale-150"></div>

                  {/* Image Gallery Container */}
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    {/* Clickable Image Area */}
                    <div
                      className="relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(item.id, currentImageIndex);
                      }}
                    >
                      <img
                        src={currentImage}
                        alt={item.name}
                        className={`
                          w-full h-48 object-cover transition-all duration-700 ease-out
                          ${
                            isHovered
                              ? "scale-110 rotate-1"
                              : "scale-100 rotate-0"
                          }
                        `}
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl" />
                    </div>

                    {/* Image Indicator Dots */}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute bottom-3 left-3 flex space-x-1 backdrop-blur-sm bg-black/50 rounded-full px-2 py-1">
                        {item.images.slice(0, 3).map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            onClick={(e) =>
                              handleDotClick(item.id, dotIndex, e)
                            }
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              currentImageIndex === dotIndex
                                ? "bg-white scale-125"
                                : "bg-white/60 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                      {getStarRating(item.rating)}
                    </div>

                    {/* Spice Level Badge */}
                    {item.spiceLevel > 0 && (
                      <div className="absolute top-12 right-3 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                        {getSpiceLevel(item.spiceLevel)}
                      </div>
                    )}

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={!item.isAvailable}
                      className={`
                        absolute bottom-3 right-3 bg-theme-accent text-white px-4 py-2 rounded-full 
                        text-sm font-semibold backdrop-blur-sm transition-all duration-300 transform
                        ${
                          isHovered
                            ? "translate-y-0 opacity-100 scale-100"
                            : "translate-y-2 opacity-0 scale-95"
                        }
                        hover:scale-110 hover:shadow-lg active:scale-95
                        ${
                          !item.isAvailable
                            ? "bg-gray-400 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >
                      {item.isAvailable ? "+ Add" : "Sold Out"}
                    </button>

                    {/* Image Counter */}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-3 left-12 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                        {currentImageIndex + 1}/
                        {Math.min(item.images.length, 3)}
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold theme-accent transition-all duration-300 group-hover:translate-x-1">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold theme-accent transition-all duration-300 group-hover:scale-110">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="opacity-80 text-sm leading-relaxed transition-all duration-300 group-hover:opacity-100 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Enhanced Tags */}
                    {enhancedItem.tags && enhancedItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {enhancedItem.tags
                          .slice(0, 3)
                          .map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-white/20 dark:bg-gray-700/50 px-2 py-1 rounded-full text-xs backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        {enhancedItem.tags.length > 3 && (
                          <span className="text-xs opacity-70">
                            +{enhancedItem.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs opacity-70 space-y-1 transition-all duration-300 group-hover:opacity-90">
                      <p className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>{item.preparationTime} mins</span>
                      </p>
                      <p className="flex items-center space-x-1">
                        <span>🍴</span>
                        <span>{item.ingredients.slice(0, 3).join(", ")}</span>
                        {item.ingredients.length > 3 && (
                          <span className="text-theme-accent">
                            +{item.ingredients.length - 3} more
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={!item.isAvailable}
                      className={`
                        w-full py-3 rounded-xl font-semibold transition-all duration-300 
                        transform hover:-translate-y-1 active:translate-y-0
                        relative overflow-hidden group/btn
                        ${
                          item.isAvailable
                            ? "theme-button hover:shadow-2xl"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }
                      `}
                    >
                      {/* Button Shine Effect */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>

                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        {item.isAvailable ? (
                          <>
                            <span>Add to Cart</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </>
                        ) : (
                          <span>Out of Stock</span>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="text-8xl mb-6 animate-bounce">🍕</div>
            <h3 className="text-2xl font-semibold mb-3 theme-accent">
              No items found
            </h3>
            <p className="opacity-80 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => dispatch(clearFilters())}
              className="px-8 py-3 theme-button rounded-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12 opacity-70 animate-fade-in-up">
            <p className="glassmorphism rounded-full px-6 py-3 inline-block backdrop-blur-lg border border-white/30">
              Showing{" "}
              <span className="theme-accent font-semibold">
                {filteredItems.length}
              </span>{" "}
              of{" "}
              <span className="theme-accent font-semibold">{items.length}</span>{" "}
              delicious items
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
