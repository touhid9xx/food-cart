import {
  MenuItem,
  MenuItemDetails,
  MenuResponse,
  MenuItemReview,
  Deal,
} from "../../types";

// Fake API delay simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced fake menu data with detailed information
export const enhancedMenuItems: MenuItemDetails[] = [
  // Pizza Category - Enhanced
  {
    id: "1",
    name: "Margherita Pizza",
    description:
      "Classic Neapolitan pizza with San Marzano tomato sauce, fresh buffalo mozzarella, and organic basil leaves. Cooked in our stone-fired oven for authentic crispiness.",
    price: 12.99,
    image: "/images/pizza/margherita-1.jpg",
    images: [
      "/images/pizza/margherita-1.jpg",
      "/images/pizza/margherita-2.jpg",
      "/images/pizza/margherita-3.jpg",
    ],
    category: "Pizza",
    ingredients: [
      "San Marzano tomatoes",
      "Buffalo mozzarella",
      "Fresh basil",
      "Extra virgin olive oil",
      "Sea salt",
    ],
    isAvailable: true,
    preparationTime: 20,
    rating: 4.8,
    spiceLevel: 0,
    nutritionalInfo: {
      calories: 850,
      protein: 35,
      carbs: 95,
      fat: 32,
      fiber: 4,
      sugar: 8,
      sodium: 1200,
    },
    allergens: ["Gluten", "Dairy"],
    servingSize: "12-inch pizza (serves 2-3)",
    cookingInstructions: "Stone-fired at 450°F for 90 seconds",
    customizationOptions: [
      {
        id: "crust",
        name: "Crust Type",
        type: "radio",
        required: true,
        options: [
          { id: "thin", name: "Thin Crust", price: 0, available: true },
          { id: "regular", name: "Regular Crust", price: 0, available: true },
          { id: "thick", name: "Thick Crust", price: 2.0, available: true },
        ],
      },
      {
        id: "cheese",
        name: "Extra Cheese",
        type: "checkbox",
        required: false,
        options: [
          {
            id: "extra-mozz",
            name: "Extra Mozzarella",
            price: 1.5,
            available: true,
          },
          { id: "parmesan", name: "Parmesan", price: 1.0, available: true },
        ],
      },
    ],
    deals: [
      {
        id: "deal-1",
        name: "Lunch Special",
        type: "percentage",
        value: 15,
        description: "15% off all pizzas during lunch hours (11 AM - 2 PM)",
        validUntil: "2024-12-31",
        applicableItems: ["1", "2", "3"],
      },
    ],
    relatedItems: ["2", "3", "7"],
    popularityScore: 95,
    tags: ["Vegetarian", "Classic", "Stone-Fired", "Italian"],
    chefRecommendation: true,
    seasonal: false,
  },
  {
    id: "2",
    name: "Pepperoni Feast",
    description:
      "Loaded with double layers of premium pepperoni, extra mozzarella cheese, and our signature tomato sauce. A crowd favorite with perfect spice balance.",
    price: 15.99,
    image: "/images/pizza/pepperoni-1.jpg",
    images: [
      "/images/pizza/pepperoni-1.jpg",
      "/images/pizza/pepperoni-2.jpg",
      "/images/pizza/pepperoni-3.jpg",
    ],
    category: "Pizza",
    ingredients: [
      "Tomato sauce",
      "Double pepperoni",
      "Mozzarella",
      "Oregano",
      "Garlic oil",
    ],
    isAvailable: true,
    preparationTime: 22,
    rating: 4.7,
    spiceLevel: 1,
    nutritionalInfo: {
      calories: 1100,
      protein: 45,
      carbs: 105,
      fat: 48,
      fiber: 3,
      sugar: 6,
      sodium: 1800,
    },
    allergens: ["Gluten", "Dairy", "Pork"],
    servingSize: "12-inch pizza (serves 2-3)",
    cookingInstructions: "Stone-fired at 450°F for 2 minutes",
    customizationOptions: [
      {
        id: "spice-level",
        name: "Spice Level",
        type: "radio",
        required: false,
        options: [
          { id: "mild", name: "Mild", price: 0, available: true },
          { id: "medium", name: "Medium", price: 0, available: true },
          { id: "hot", name: "Hot", price: 0, available: true },
        ],
      },
    ],
    deals: [
      {
        id: "deal-2",
        name: "Family Deal",
        type: "fixed",
        value: 3,
        description: "$3 off when you order 2 or more pizzas",
        minOrderAmount: 30,
        applicableItems: ["1", "2", "3"],
      },
    ],
    relatedItems: ["1", "3", "4"],
    popularityScore: 88,
    tags: ["Meat Lovers", "Spicy", "Family Favorite"],
    chefRecommendation: false,
    seasonal: false,
  },
  {
    id: "3",
    name: "Vegetarian Supreme",
    description:
      "Fresh organic vegetables on a thin crust with olive oil base. Features bell peppers, mushrooms, onions, black olives, and artichoke hearts.",
    price: 14.99,
    image: "/images/pizza/vegetarian-1.jpg",
    images: [
      "/images/pizza/vegetarian-1.jpg",
      "/images/pizza/vegetarian-2.jpg",
      "/images/pizza/vegetarian-3.jpg",
    ],
    category: "Pizza",
    ingredients: [
      "Bell peppers",
      "Mushrooms",
      "Onions",
      "Black olives",
      "Artichoke hearts",
      "Tomato sauce",
    ],
    isAvailable: true,
    preparationTime: 18,
    rating: 4.6,
    spiceLevel: 0,
    nutritionalInfo: {
      calories: 920,
      protein: 28,
      carbs: 110,
      fat: 35,
      fiber: 8,
      sugar: 7,
      sodium: 1100,
    },
    allergens: ["Gluten"],
    servingSize: "12-inch pizza (serves 2-3)",
    cookingInstructions: "Stone-fired at 450°F for 2 minutes",
    customizationOptions: [
      {
        id: "vegan-option",
        name: "Make it Vegan",
        type: "checkbox",
        required: false,
        options: [
          {
            id: "vegan-cheese",
            name: "Vegan Cheese",
            price: 2.0,
            available: true,
          },
          { id: "no-cheese", name: "No Cheese", price: -2.0, available: true },
        ],
      },
    ],
    deals: [
      {
        id: "deal-3",
        name: "Vegetarian Week",
        type: "percentage",
        value: 10,
        description: "10% off all vegetarian items",
        validUntil: "2024-12-31",
        applicableItems: ["3", "9", "10"],
      },
    ],
    relatedItems: ["1", "2", "9"],
    popularityScore: 82,
    tags: ["Vegetarian", "Healthy", "Organic"],
    chefRecommendation: true,
    seasonal: false,
  },
  // Burgers Category - Enhanced
  {
    id: "4",
    name: "Classic Beef Burger",
    description:
      "Premium Angus beef patty with crisp lettuce, ripe tomato, red onion, and our signature burger sauce on a brioche bun.",
    price: 10.99,
    image: "/images/burgers/beef-1.jpg",
    images: [
      "/images/burgers/beef-1.jpg",
      "/images/burgers/beef-2.jpg",
      "/images/burgers/beef-3.jpg",
    ],
    category: "Burgers",
    ingredients: [
      "Angus beef patty",
      "Lettuce",
      "Tomato",
      "Red onion",
      "Signature sauce",
      "Brioche bun",
    ],
    isAvailable: true,
    preparationTime: 12,
    rating: 4.5,
    spiceLevel: 1,
    nutritionalInfo: {
      calories: 780,
      protein: 42,
      carbs: 45,
      fat: 38,
      fiber: 3,
      sugar: 8,
      sodium: 950,
    },
    allergens: ["Gluten", "Dairy", "Egg"],
    servingSize: "1 burger with fries",
    cookingInstructions: "Grilled to perfection, medium recommended",
    customizationOptions: [
      {
        id: "cook-level",
        name: "Cook Level",
        type: "radio",
        required: true,
        options: [
          { id: "medium-rare", name: "Medium Rare", price: 0, available: true },
          { id: "medium", name: "Medium", price: 0, available: true },
          { id: "medium-well", name: "Medium Well", price: 0, available: true },
          { id: "well-done", name: "Well Done", price: 0, available: true },
        ],
      },
      {
        id: "add-ons",
        name: "Add-ons",
        type: "checkbox",
        required: false,
        options: [
          { id: "bacon", name: "Crispy Bacon", price: 2.5, available: true },
          { id: "cheese", name: "Extra Cheese", price: 1.5, available: true },
          {
            id: "avocado",
            name: "Fresh Avocado",
            price: 1.75,
            available: true,
          },
        ],
      },
    ],
    deals: [
      {
        id: "deal-4",
        name: "Burger Combo",
        type: "fixed",
        value: 2,
        description: "Add fries and drink for only $2 extra",
        applicableItems: ["4", "5", "6"],
      },
    ],
    relatedItems: ["5", "6", "13"],
    popularityScore: 90,
    tags: ["Beef", "Classic", "Angus"],
    chefRecommendation: false,
    seasonal: false,
  },
  {
    id: "5",
    name: "Spicy Chicken Burger",
    description:
      "Crispy buttermilk chicken breast with spicy mayo, fresh vegetables, and pickles on a sesame seed bun.",
    price: 9.99,
    image: "/images/burgers/chicken-1.jpg",
    images: [
      "/images/burgers/chicken-1.jpg",
      "/images/burgers/chicken-2.jpg",
      "/images/burgers/chicken-3.jpg",
    ],
    category: "Burgers",
    ingredients: [
      "Chicken breast",
      "Spicy mayo",
      "Lettuce",
      "Tomato",
      "Pickles",
      "Sesame bun",
    ],
    isAvailable: true,
    preparationTime: 15,
    rating: 4.6,
    spiceLevel: 2,
    nutritionalInfo: {
      calories: 720,
      protein: 38,
      carbs: 52,
      fat: 28,
      fiber: 2,
      sugar: 6,
      sodium: 1100,
    },
    allergens: ["Gluten", "Egg", "Sesame"],
    servingSize: "1 burger with fries",
    cookingInstructions: "Crispy fried chicken breast",
    customizationOptions: [
      {
        id: "spice-level",
        name: "Spice Level",
        type: "radio",
        required: false,
        options: [
          { id: "mild", name: "Mild", price: 0, available: true },
          { id: "medium", name: "Medium", price: 0, available: true },
          { id: "hot", name: "Hot", price: 0, available: true },
        ],
      },
    ],
    deals: [],
    relatedItems: ["4", "6", "13"],
    popularityScore: 85,
    tags: ["Chicken", "Spicy", "Crispy"],
    chefRecommendation: false,
    seasonal: false,
  },
  // Add more items as needed...
];

// Sample reviews data
export const menuItemReviews: { [key: string]: MenuItemReview[] } = {
  "1": [
    {
      id: "rev-1",
      userId: "user1",
      userName: "Sarah M.",
      userAvatar: "/avatars/user1.jpg",
      rating: 5,
      comment:
        "Absolutely delicious! The crust was perfectly crispy and the ingredients were so fresh. Will definitely order again!",
      createdAt: "2024-01-15",
      helpful: 12,
      verifiedPurchase: true,
    },
    {
      id: "rev-2",
      userId: "user2",
      userName: "Mike R.",
      userAvatar: "/avatars/user2.jpg",
      rating: 4,
      comment:
        "Great pizza, but could use a bit more basil. Overall very satisfied with the quality.",
      createdAt: "2024-01-10",
      helpful: 5,
      verifiedPurchase: true,
    },
  ],
  "2": [
    {
      id: "rev-3",
      userId: "user3",
      userName: "John D.",
      userAvatar: "/avatars/user3.jpg",
      rating: 5,
      comment:
        "Best pepperoni pizza I've ever had! The double pepperoni is amazing.",
      createdAt: "2024-01-12",
      helpful: 8,
      verifiedPurchase: true,
    },
  ],
};

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
