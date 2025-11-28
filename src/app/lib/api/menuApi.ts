import { MenuItem, MenuResponse } from "../../types";

// Fake API delay simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced fake menu data with multiple images
export const fakeMenuItems: MenuItem[] = [
  // Pizza Category
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil",
    price: 12.99,
    image: "/images/pizza/margherita-1.jpg",
    images: [
      "/images/pizza/margherita-1.jpg",
      "/images/pizza/margherita-2.jpg",
      "/images/pizza/margherita-3.jpg",
    ],
    category: "Pizza",
    ingredients: ["Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
    isAvailable: true,
    preparationTime: 20,
    rating: 4.8,
    spiceLevel: 0,
  },
  {
    id: "2",
    name: "Pepperoni Feast",
    description: "Loaded with double pepperoni and extra cheese",
    price: 15.99,
    image: "/images/pizza/pepperoni-1.jpg",
    images: [
      "/images/pizza/pepperoni-1.jpg",
      "/images/pizza/pepperoni-2.jpg",
      "/images/pizza/pepperoni-3.jpg",
    ],
    category: "Pizza",
    ingredients: ["Tomato sauce", "Mozzarella", "Pepperoni", "Herbs"],
    isAvailable: true,
    preparationTime: 22,
    rating: 4.7,
    spiceLevel: 1,
  },
  {
    id: "3",
    name: "Vegetarian Supreme",
    description: "Fresh vegetables on a thin crust with olive oil base",
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
      "Olives",
      "Tomato sauce",
    ],
    isAvailable: true,
    preparationTime: 18,
    rating: 4.6,
    spiceLevel: 0,
  },

  // Burgers Category
  {
    id: "4",
    name: "Classic Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 10.99,
    image: "/images/burgers/beef-1.jpg",
    images: [
      "/images/burgers/beef-1.jpg",
      "/images/burgers/beef-2.jpg",
      "/images/burgers/beef-3.jpg",
    ],
    category: "Burgers",
    ingredients: ["Beef patty", "Lettuce", "Tomato", "Onion", "Special sauce"],
    isAvailable: true,
    preparationTime: 12,
    rating: 4.5,
    spiceLevel: 1,
  },
  {
    id: "5",
    name: "Spicy Chicken Burger",
    description: "Crispy chicken burger with spicy mayo and fresh vegetables",
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
    ],
    isAvailable: true,
    preparationTime: 15,
    rating: 4.6,
    spiceLevel: 2,
  },
  {
    id: "6",
    name: "Mushroom Swiss Burger",
    description: "Beef patty topped with sautéed mushrooms and Swiss cheese",
    price: 11.99,
    image: "/images/burgers/mushroom-1.jpg",
    images: [
      "/images/burgers/mushroom-1.jpg",
      "/images/burgers/mushroom-2.jpg",
      "/images/burgers/mushroom-3.jpg",
    ],
    category: "Burgers",
    ingredients: [
      "Beef patty",
      "Mushrooms",
      "Swiss cheese",
      "Caramelized onions",
    ],
    isAvailable: true,
    preparationTime: 14,
    rating: 4.7,
    spiceLevel: 0,
  },

  // Pasta Category
  {
    id: "7",
    name: "Spaghetti Carbonara",
    description: "Creamy pasta with bacon, eggs, and parmesan cheese",
    price: 13.99,
    image: "/images/pasta/carbonara-1.jpg",
    images: [
      "/images/pasta/carbonara-1.jpg",
      "/images/pasta/carbonara-2.jpg",
      "/images/pasta/carbonara-3.jpg",
    ],
    category: "Pasta",
    ingredients: ["Spaghetti", "Bacon", "Eggs", "Parmesan", "Black pepper"],
    isAvailable: true,
    preparationTime: 16,
    rating: 4.8,
    spiceLevel: 0,
  },
  {
    id: "8",
    name: "Vegetable Pasta",
    description: "Penne pasta with fresh vegetables in a light tomato sauce",
    price: 11.99,
    image: "/images/pasta/vegetable-1.jpg",
    images: [
      "/images/pasta/vegetable-1.jpg",
      "/images/pasta/vegetable-2.jpg",
      "/images/pasta/vegetable-3.jpg",
    ],
    category: "Pasta",
    ingredients: [
      "Penne pasta",
      "Bell peppers",
      "Zucchini",
      "Tomato sauce",
      "Herbs",
    ],
    isAvailable: true,
    preparationTime: 18,
    rating: 4.5,
    spiceLevel: 1,
  },

  // Salads Category
  {
    id: "9",
    name: "Caesar Salad",
    description:
      "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    image: "/images/salads/caesar-1.jpg",
    images: [
      "/images/salads/caesar-1.jpg",
      "/images/salads/caesar-2.jpg",
      "/images/salads/caesar-3.jpg",
    ],
    category: "Salads",
    ingredients: [
      "Romaine lettuce",
      "Caesar dressing",
      "Croutons",
      "Parmesan cheese",
    ],
    isAvailable: true,
    preparationTime: 10,
    rating: 4.4,
    spiceLevel: 0,
  },
  {
    id: "10",
    name: "Greek Salad",
    description: "Traditional Greek salad with feta cheese and olives",
    price: 9.99,
    image: "/images/salads/greek-1.jpg",
    images: [
      "/images/salads/greek-1.jpg",
      "/images/salads/greek-2.jpg",
      "/images/salads/greek-3.jpg",
    ],
    category: "Salads",
    ingredients: [
      "Cucumbers",
      "Tomatoes",
      "Red onions",
      "Feta cheese",
      "Olives",
    ],
    isAvailable: true,
    preparationTime: 8,
    rating: 4.6,
    spiceLevel: 0,
  },

  // Desserts Category
  {
    id: "11",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with vanilla ice cream",
    price: 6.99,
    image: "/images/desserts/brownie-1.jpg",
    images: [
      "/images/desserts/brownie-1.jpg",
      "/images/desserts/brownie-2.jpg",
      "/images/desserts/brownie-3.jpg",
    ],
    category: "Desserts",
    ingredients: ["Chocolate", "Flour", "Butter", "Sugar", "Vanilla ice cream"],
    isAvailable: true,
    preparationTime: 5,
    rating: 4.9,
    spiceLevel: 0,
  },
  {
    id: "12",
    name: "New York Cheesecake",
    description: "Creamy cheesecake with berry compote",
    price: 7.99,
    image: "/images/desserts/cheesecake-1.jpg",
    images: [
      "/images/desserts/cheesecake-1.jpg",
      "/images/desserts/cheesecake-2.jpg",
      "/images/desserts/cheesecake-3.jpg",
    ],
    category: "Desserts",
    ingredients: [
      "Cream cheese",
      "Graham cracker crust",
      "Berry compote",
      "Whipped cream",
    ],
    isAvailable: true,
    preparationTime: 3,
    rating: 4.8,
    spiceLevel: 0,
  },

  // Beverages Category
  {
    id: "13",
    name: "Iced Coffee",
    description: "Chilled coffee with milk and your choice of syrup",
    price: 4.99,
    image: "/images/beverages/coffee-1.jpg",
    images: [
      "/images/beverages/coffee-1.jpg",
      "/images/beverages/coffee-2.jpg",
      "/images/beverages/coffee-3.jpg",
    ],
    category: "Beverages",
    ingredients: ["Coffee", "Milk", "Ice", "Vanilla syrup"],
    isAvailable: true,
    preparationTime: 3,
    rating: 4.7,
    spiceLevel: 0,
  },
  {
    id: "14",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice, served chilled",
    price: 3.99,
    image: "/images/beverages/juice-1.jpg",
    images: [
      "/images/beverages/juice-1.jpg",
      "/images/beverages/juice-2.jpg",
      "/images/beverages/juice-3.jpg",
    ],
    category: "Beverages",
    ingredients: ["Fresh oranges"],
    isAvailable: true,
    preparationTime: 2,
    rating: 4.5,
    spiceLevel: 0,
  },
];

// API Service functions
export const menuApi = {
  // Fetch all menu items with categories
  fetchMenu: async (): Promise<MenuResponse> => {
    await delay(1000); // Simulate API delay

    const categories = Array.from(
      new Set(fakeMenuItems.map((item) => item.category))
    );

    return {
      categories,
      items: fakeMenuItems,
    };
  },

  // Fetch menu items by category
  fetchMenuByCategory: async (category: string): Promise<MenuItem[]> => {
    await delay(800); // Simulate API delay

    return fakeMenuItems.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Fetch single menu item by ID
  fetchMenuItemById: async (id: string): Promise<MenuItem | undefined> => {
    await delay(500); // Simulate API delay

    return fakeMenuItems.find((item) => item.id === id);
  },

  // Search menu items
  searchMenuItems: async (query: string): Promise<MenuItem[]> => {
    await delay(600); // Simulate API delay

    const lowercaseQuery = query.toLowerCase();
    return fakeMenuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(lowercaseQuery)
        )
    );
  },
};
