/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "../../lib/hooks";
import { addToCart } from "../../lib/slices/cartSlice";
import { useAlert } from "../../lib/hooks/useAlert";
import { useFlyingItems } from "../../components/Animation/FlyingItemsProvider";
import { enhancedMenuApi } from "../../lib/api/enhancedMenuApi";
import {
  MenuItemDetails,
  MenuItemReview,
  Deal,
  CustomizationOption,
  MenuItem,
} from "../../types";
import { getCartIconPosition } from "../../components/CartIcon"; // Fixed import

export default function MenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, error } = useAlert();
  const { flyItem } = useFlyingItems();

  const itemId = params.id as string;
  const [menuItem, setMenuItem] = useState<MenuItemDetails | null>(null);
  const [reviews, setReviews] = useState<MenuItemReview[]>([]);
  const [relatedItems, setRelatedItems] = useState<MenuItemDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<{
    [key: string]: string[] | number;
  }>({});
  const [activeTab, setActiveTab] = useState("details");

  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const cartIconPosition = useRef({ x: 50, y: 50 });

  useEffect(() => {
    loadMenuItemData();

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
  }, [itemId]);

  const loadMenuItemData = async () => {
    try {
      setLoading(true);
      const [itemData, reviewsData, relatedData] = await Promise.all([
        enhancedMenuApi.fetchMenuItemById(itemId),
        enhancedMenuApi.fetchMenuItemReviews(itemId),
        enhancedMenuApi.fetchRelatedItems(itemId),
      ]);

      if (!itemData) {
        error("Menu item not found", "Not Found");
        router.push("/menu");
        return;
      }

      setMenuItem(itemData);
      setReviews(reviewsData);
      setRelatedItems(relatedData as MenuItemDetails[]);
    } catch (err) {
      error("Failed to load menu item", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizationChange = (
    optionId: string,
    value: string | number,
    type: "radio" | "checkbox" | "number"
  ) => {
    setCustomizations((prev) => {
      if (type === "radio") {
        return { ...prev, [optionId]: [value as string] };
      } else if (type === "checkbox") {
        const current = (prev[optionId] as string[]) || [];
        const updated = current.includes(value as string)
          ? current.filter((id) => id !== value)
          : [...current, value as string];
        return { ...prev, [optionId]: updated };
      } else if (type === "number") {
        return { ...prev, [optionId]: value as number };
      }
      return prev;
    });
  };

  const calculateTotalPrice = () => {
    if (!menuItem) return 0;

    let total = menuItem.price * quantity;

    // Add customization prices
    Object.entries(customizations).forEach(([optionId, value]) => {
      const option = menuItem.customizationOptions.find(
        (opt) => opt.id === optionId
      );
      if (!option) return;

      if (option.type === "number" && typeof value === "number") {
        // For number type, multiply price by quantity
        const choice = option.options[0]; // Usually only one option for number type
        if (choice) {
          total += choice.price * value * quantity;
        }
      } else if (Array.isArray(value)) {
        // For radio/checkbox types
        value.forEach((choiceId) => {
          const choice = option.options.find((opt) => opt.id === choiceId);
          if (choice) {
            total += choice.price * quantity;
          }
        });
      }
    });

    return total;
  };

  const handleAddToCart = () => {
    if (!menuItem) return;

    // Get the add to cart button position
    if (addToCartButtonRef.current) {
      const buttonRect = addToCartButtonRef.current.getBoundingClientRect();
      const startPosition = {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
      };

      // Trigger flying animation
      flyItem(startPosition, cartIconPosition.current, menuItem.image);
    }

    // Convert MenuItemDetails to basic MenuItem for cart and add to cart
    const menuItemForCart: MenuItem = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: calculateTotalPrice() / quantity,
      image: menuItem.image,
      images: menuItem.images,
      category: menuItem.category,
      ingredients: menuItem.ingredients,
      isAvailable: menuItem.isAvailable,
      preparationTime: menuItem.preparationTime,
      rating: menuItem.rating,
      spiceLevel: menuItem.spiceLevel,
      dietaryInfo: menuItem.dietaryInfo,
    };

    const specialInstructions =
      Object.keys(customizations).length > 0
        ? `Customizations: ${JSON.stringify(customizations)}`
        : undefined;

    // Add to cart after a small delay for better visual effect
    setTimeout(() => {
      dispatch(
        addToCart({
          menuItem: menuItemForCart,
          quantity,
          specialInstructions,
        })
      );
      success(`Added ${quantity} ${menuItem.name} to cart!`, "Added to Cart");
    }, 300);
  };

  const getStarRating = (rating: number) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const getSpiceLevel = (level: number) => {
    const spices = ["🌱 Mild", "🌶️ Medium", "🔥 Hot", "💀 Extra Hot"];
    return spices[level] || spices[0];
  };

  const renderCustomizationOption = (option: CustomizationOption) => {
    switch (option.type) {
      case "radio":
        return (
          <div className="space-y-2">
            {option.options.map((choice) => (
              <label
                key={choice.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={option.id}
                  checked={
                    (customizations[option.id] as string[])?.includes(
                      choice.id
                    ) || false
                  }
                  onChange={() =>
                    handleCustomizationChange(option.id, choice.id, "radio")
                  }
                  className="text-theme-accent focus:ring-theme-accent"
                  disabled={!choice.available}
                />
                <span className="flex-1">{choice.name}</span>
                {choice.price > 0 && (
                  <span className="text-theme-accent font-semibold">
                    +${choice.price.toFixed(2)}
                  </span>
                )}
                {!choice.available && (
                  <span className="text-xs text-gray-500">Unavailable</span>
                )}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {option.options.map((choice) => (
              <label
                key={choice.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    (customizations[option.id] as string[])?.includes(
                      choice.id
                    ) || false
                  }
                  onChange={() =>
                    handleCustomizationChange(option.id, choice.id, "checkbox")
                  }
                  className="text-theme-accent focus:ring-theme-accent"
                  disabled={!choice.available}
                />
                <span className="flex-1">{choice.name}</span>
                {choice.price > 0 && (
                  <span className="text-theme-accent font-semibold">
                    +${choice.price.toFixed(2)}
                  </span>
                )}
                {!choice.available && (
                  <span className="text-xs text-gray-500">Unavailable</span>
                )}
              </label>
            ))}
          </div>
        );

      case "number":
        const currentValue = (customizations[option.id] as number) || 0;
        const choice = option.options[0]; // Usually only one option for number type
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCustomizationChange(
                    option.id,
                    Math.max(0, currentValue - 1),
                    "number"
                  )
                }
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                disabled={!choice?.available}
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">
                {currentValue}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCustomizationChange(
                    option.id,
                    currentValue + 1,
                    "number"
                  )
                }
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                disabled={!choice?.available}
              >
                +
              </button>
            </div>
            {choice && (
              <div className="flex-1">
                <span className="text-sm text-gray-600">{choice.name}</span>
                {choice.price > 0 && (
                  <span className="text-theme-accent font-semibold ml-2">
                    +${choice.price.toFixed(2)} each
                  </span>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-300 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <Link href="/menu" className="theme-button px-6 py-3 rounded-lg">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/menu" className="text-theme-accent hover:underline">
            ← Back to Menu
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={menuItem.images?.[selectedImageIndex] || menuItem.image}
                alt={menuItem.name}
                className="w-full h-96 object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {menuItem.chefRecommendation && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    👨‍🍳 Chef's Choice
                  </span>
                )}
                {menuItem.seasonal && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🍂 Seasonal
                  </span>
                )}
                {menuItem.spiceLevel > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {getSpiceLevel(menuItem.spiceLevel)}
                  </span>
                )}
              </div>

              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {getStarRating(menuItem.rating)}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-2">
              {menuItem.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-theme-accent scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${menuItem.name} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold theme-accent mb-2">
                {menuItem.name}
              </h1>
              <p className="text-xl opacity-80 mb-4">{menuItem.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold theme-accent">
                  ${totalPrice.toFixed(2)}
                </span>
                {menuItem.deals.length > 0 && (
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                    🎁 Deals Available
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div
              className={`p-4 rounded-lg ${
                menuItem.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {menuItem.isAvailable ? (
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>
                    Available • Ready in {menuItem.preparationTime} mins
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span>Currently Unavailable</span>
                </div>
              )}
            </div>

            {/* Deals */}
            {menuItem.deals.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🎁 Special Offers
                </h3>
                {menuItem.deals.map((deal) => (
                  <div key={deal.id} className="text-sm text-blue-700">
                    <strong>{deal.name}:</strong> {deal.description}
                  </div>
                ))}
              </div>
            )}

            {/* Customizations */}
            {menuItem.customizationOptions.map((option) => (
              <div key={option.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">
                  {option.name}
                  {option.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h4>
                {renderCustomizationOption(option)}
              </div>
            ))}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                ref={addToCartButtonRef}
                onClick={handleAddToCart}
                disabled={!menuItem.isAvailable}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  menuItem.isAvailable
                    ? "theme-button hover:scale-105"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {menuItem.isAvailable
                  ? `Add to Cart - $${totalPrice.toFixed(2)}`
                  : "Out of Stock"}
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>{menuItem.preparationTime} min preparation</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🍽️</span>
                <span>{menuItem.servingSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span>{menuItem.nutritionalInfo?.calories} calories</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>{menuItem.rating} rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Additional Information */}
        <div className="mt-16">
          <div className="border-b">
            <nav className="flex space-x-8">
              {["details", "nutrition", "reviews", "related"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all ${
                    activeTab === tab
                      ? "border-theme-accent text-theme-accent"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {menuItem.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {menuItem.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                      >
                        {allergen}
                      </span>
                    ))}
                    {menuItem.allergens.length === 0 && (
                      <span className="text-green-600">
                        No common allergens
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === "nutrition" && menuItem.nutritionalInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(menuItem.nutritionalInfo).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl font-bold theme-accent">
                        {value}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {review.userAvatar ? (
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <span className="font-semibold">
                              {review.userName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{review.userName}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{getStarRating(review.rating)}</span>
                            <span>•</span>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.verifiedPurchase && (
                              <span className="text-green-600">✓ Verified</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this item!
                  </div>
                )}
              </div>
            )}

            {/* Related Items Tab */}
            {activeTab === "related" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/menu/${item.id}`}
                    className="block border rounded-lg p-4 hover:shadow-lg transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h4 className="font-semibold theme-accent">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
