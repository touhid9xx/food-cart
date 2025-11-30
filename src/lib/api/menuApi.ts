import {
  MenuItem,
  MenuItemDetails,
  MenuResponse,
  MenuItemReview,
  Deal,
} from "../../types";
import { enhancedMenuItems, menuItemReviews } from "../data";

// Fake API delay simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced API Service functions
export const menuApi = {
  // Fetch all menu items with categories
  fetchMenu: async (): Promise<MenuResponse> => {
    await delay(1000);

    const categories = Array.from(
      new Set(enhancedMenuItems.map((item) => item.category))
    );

    return {
      categories,
      items: enhancedMenuItems,
    };
  },

  // Fetch menu items by category
  fetchMenuByCategory: async (category: string): Promise<MenuItem[]> => {
    await delay(800);
    return enhancedMenuItems.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Fetch single menu item by ID with full details
  fetchMenuItemById: async (
    id: string
  ): Promise<MenuItemDetails | undefined> => {
    await delay(500);
    return enhancedMenuItems.find((item) => item.id === id);
  },

  // Search menu items
  searchMenuItems: async (query: string): Promise<MenuItem[]> => {
    await delay(600);
    const lowercaseQuery = query.toLowerCase();
    return enhancedMenuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(lowercaseQuery)
        ) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Fetch reviews for a menu item
  fetchMenuItemReviews: async (itemId: string): Promise<MenuItemReview[]> => {
    await delay(400);
    return menuItemReviews[itemId] || [];
  },

  // Fetch related items
  fetchRelatedItems: async (itemId: string): Promise<MenuItem[]> => {
    await delay(300);
    const item = enhancedMenuItems.find((i) => i.id === itemId);
    if (!item) return [];

    return enhancedMenuItems.filter(
      (i) => item.relatedItems.includes(i.id) && i.id !== itemId
    );
  },

  // Check item availability
  checkAvailability: async (itemId: string): Promise<boolean> => {
    await delay(200);
    const item = enhancedMenuItems.find((i) => i.id === itemId);
    return item?.isAvailable || false;
  },

  // Get current deals for an item
  getItemDeals: async (itemId: string): Promise<Deal[]> => {
    await delay(300);
    const item = enhancedMenuItems.find((i) => i.id === itemId);
    return item?.deals || [];
  },
};
