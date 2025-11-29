// data/index.ts

// ========== AUTH DATA ==========
export interface UserWithPassword extends User {
  password: string;
}

export const fakeUsers: UserWithPassword[] = [
  {
    id: "user_1",
    email: "john@tushar.com",
    name: "John Smith",
    role: "customer",
    avatar: "/images/avatars/john.jpg",
    isEmailVerified: true,
    isPhoneVerified: true,
    password: "password123",
  },
  {
    id: "user_2",
    email: "sarah@tushar.com",
    name: "Sarah Johnson",
    role: "customer",
    avatar: "/images/avatars/sarah.jpg",
    isEmailVerified: true,
    isPhoneVerified: false,
    password: "password123",
  },
  {
    id: "admin_1",
    email: "admin@tushar.com",
    name: "System Admin",
    role: "admin",
    isEmailVerified: true,
    isPhoneVerified: true,
    password: "admin123",
  },
];

// ========== CUSTOMER DATA ==========
export const fakeCustomers: Customer[] = [
  {
    id: "cust_1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/images/avatars/john.png",
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      dietary: ["gluten-free", "low-sodium"],
      favoriteCuisines: ["Italian", "Mexican", "Japanese"],
      spicePreference: "medium",
      deliveryInstructions:
        "Please ring doorbell twice and leave at the front door. No contact with pets please.",
      specialRequirements:
        "Please ensure all items are gluten-free. Avoid cross-contamination with seafood.",
      cutleryPreference: "do_not_include",
      contactlessDelivery: true,
    },
    addresses: [
      {
        id: "addr_1",
        type: "home",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        isDefault: true,
        instructions: "Apartment 4B, buzz code #1234",
        deliveryInstructions:
          "Leave package in the lobby if no answer. Do not leave outside in rain.",
        dietaryRestrictionsNote:
          "Severe gluten allergy in household. Please ensure no bread items.",
      },
    ],
    paymentMethods: [
      {
        id: "pay_1",
        type: "cash",
        isDefault: true,
      },
    ],
    reviews: [
      {
        id: "rev_1",
        menuItemId: "1",
        menuItemName: "Margherita Pizza",
        rating: 5,
        comment: "Absolutely delicious! The gluten-free crust was perfect!",
        createdAt: "2024-01-15T14:30:00Z",
        images: ["/images/reviews/pizza-1.jpg"],
        helpful: 12,
        dietaryComment: "Excellent gluten-free options",
      },
    ],
    dietaryRestrictions: ["Celiac Disease", "Gluten Intolerance"],
    loyaltyPoints: 1250,
    joinedDate: "2023-06-15T00:00:00Z",
    lastOrderDate: "2024-01-15T14:30:00Z",
  },
];

export const fakeOrderHistory: OrderHistory[] = [
  {
    id: "order_1",
    orderNumber: "ORD-001234",
    items: [
      {
        id: "item_1",
        name: "Margherita Pizza",
        quantity: 1,
        price: 12.99,
        image: "/images/pizza/margherita-1.jpg",
        specialInstructions: "Extra cheese, well done",
        dietaryRequirements: "Gluten-free crust required",
      },
    ],
    total: 12.99,
    status: "completed",
    orderDate: "2024-01-15T14:30:00Z",
    deliveryAddress: fakeCustomers[0].addresses[0],
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
      image: "/images/restaurants/pizza-palace.jpg",
    },
    deliveryInstructions: "Leave at door, don't ring bell",
    specialRequirements: "Severe gluten allergy - no cross contamination",
    rating: 5,
    review: "Great service and food was delicious!",
    customerId: "cust_1",
  },
];

export const deliveryInstructions: DeliveryInstruction[] = [
  {
    id: "deliv_1",
    type: "leave_at_door",
    message: "Leave at my door. No need to knock or ring bell.",
    isDefault: true,
  },
  {
    id: "deliv_2",
    type: "hand_to_me",
    message: "Please hand it to me directly.",
    isDefault: false,
  },
];

export const dietaryRestrictions: DietaryRestriction[] = [
  {
    id: "diet_1",
    type: "allergy",
    name: "Peanut Allergy",
    severity: "severe",
    description: "Life-threatening allergy to peanuts and peanut products",
  },
  {
    id: "diet_2",
    type: "intolerance",
    name: "Lactose Intolerance",
    severity: "moderate",
    description: "Difficulty digesting lactose in dairy products",
  },
];

// ========== MENU DATA ==========
export const enhancedMenuItems: MenuItemDetails[] = [
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
  // Add more menu items as needed...
];

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

// ========== ORDER DATA ==========
export const fakeOrders: OrderSummary[] = [
  {
    id: "order_001",
    orderNumber: "ORD-2024-001234",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 (555) 123-4567",
    items: [
      { id: "item_1", name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { id: "item_2", name: "Garlic Bread", quantity: 2, price: 4.99 },
    ],
    total: 22.97,
    status: "delivered",
    orderDate: "2024-01-15T14:30:00Z",
    estimatedDelivery: "2024-01-15T15:15:00Z",
    deliveryAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    specialInstructions: "Leave at door, don't ring bell",
    dietaryRequirements: "Gluten-free crust required",
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
    },
    deliveryDriver: {
      id: "driver_1",
      name: "Mike Johnson",
      phone: "+1 (555) 987-6543",
    },
  },
  {
    id: "order_002",
    orderNumber: "ORD-2024-001235",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1 (555) 234-5678",
    items: [
      { id: "item_3", name: "Pepperoni Feast", quantity: 1, price: 15.99 },
      { id: "item_4", name: "Caesar Salad", quantity: 1, price: 8.99 },
      { id: "item_5", name: "Iced Coffee", quantity: 1, price: 4.99 },
    ],
    total: 29.97,
    status: "out_for_delivery",
    orderDate: "2024-01-15T18:45:00Z",
    estimatedDelivery: "2024-01-15T19:30:00Z",
    deliveryAddress: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002",
    },
    paymentMethod: "digital_wallet",
    paymentStatus: "paid",
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
    },
    deliveryDriver: {
      id: "driver_2",
      name: "Emily Chen",
      phone: "+1 (555) 876-5432",
    },
  },
  // Add more orders as needed...
];

// ========== TOKEN STORAGE ==========
export const fakeTokenStorage = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
};
