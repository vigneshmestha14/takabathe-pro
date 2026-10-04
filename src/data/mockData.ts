export interface Product {
  id: string;
  name: string;
  category: 'fish' | 'masala' | 'combo';
  price: number; // Price per KG for fish, or per pack for masala
  unit: 'KG' | 'pack' | 'combo';
  rating: number;
  reviewsCount: number;
  description: string;
  harborOrigin?: string;
  boneType?: 'Single Center Bone' | 'Boneless' | 'Few Bones' | 'Multi-bone';
  texture?: 'Delicate & Flaky' | 'Firm & Meaty' | 'Succulent & Tender' | 'Rich & Oily';
  bestCookingStyle?: string;
  cutOptions?: string[];
  isAvailable: boolean;
  image: string;
  tag?: string;
  discountPercentage?: number;
  weightSteps?: number[]; // e.g. [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
}

export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Chef Special';
  image: string;
  pairedFish: string;
  ingredients: string[];
  steps: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  qty: number; // in KG or packs
  selectedCut?: string;
  specialInstructions?: string;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliverySlot: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'harbor_landed' | 'hand_cut' | 'ice_packed' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Silver Pomfret (Manoji / Paplet)',
    category: 'fish',
    price: 950,
    unit: 'KG',
    rating: 4.9,
    reviewsCount: 142,
    description: 'Ultra-delicate white meat with a single center bone. Hand-cut today and kept on crushed ocean ice.',
    harborOrigin: 'Malpe Deep Sea Harbor • Landed 4:30 AM',
    boneType: 'Single Center Bone',
    texture: 'Delicate & Flaky',
    bestCookingStyle: 'Pan Fry, Tawa Roast, Malabar Coconut Curry',
    cutOptions: ['Whole Cleaned & Scaled', 'Tawa Fry Steaks', 'Curry Cut (Medium Cubes)', 'Fillet (Boneless)'],
    isAvailable: true,
    image: './images/pomfret.png',
    tag: "Chef's Choice",
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-2',
    name: 'Surmai / Kingfish (Seer Fish)',
    category: 'fish',
    price: 1150,
    unit: 'KG',
    rating: 5.0,
    reviewsCount: 218,
    description: 'Firm, premium thick steaks with rich omega-3 oils. The ultimate coastal favorite for tawa fry.',
    harborOrigin: 'Mangalore Old Port • Landed 5:15 AM',
    boneType: 'Single Center Bone',
    texture: 'Firm & Meaty',
    bestCookingStyle: 'Crispy Tawa Fry, Ghee Roast, Fish Biryani',
    cutOptions: ['Tawa Fry Steaks', 'Curry Cut', 'Biryani Cut', 'Center Cut Steaks'],
    isAvailable: true,
    image: './images/surmai.png',
    tag: 'Bestseller',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-3',
    name: 'Jumbo Tiger Prawns',
    category: 'fish',
    price: 820,
    unit: 'KG',
    rating: 4.8,
    reviewsCount: 189,
    description: 'Succulent, large juicy tiger prawns. De-veined, peeled, and prepped fresh to order.',
    harborOrigin: 'Kundapur Estuary • Landed 6:00 AM',
    boneType: 'Boneless',
    texture: 'Succulent & Tender',
    bestCookingStyle: 'Butter Garlic Fry, Ghee Roast, Prawns Masala',
    cutOptions: ['Peeled & De-veined', 'Tail-On Cleaned', 'Whole Unpeeled'],
    isAvailable: true,
    image: './images/prawns.png',
    tag: 'Fresh Catch',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-4',
    name: 'Indian Mackerel (Bangda)',
    category: 'fish',
    price: 380,
    unit: 'KG',
    rating: 4.7,
    reviewsCount: 96,
    description: 'High omega-3 coastal classic. Slitted and prepped for fiery stuffed green recheado fry.',
    harborOrigin: 'Honnavar Coastal Dock • Landed 5:45 AM',
    boneType: 'Multi-bone',
    texture: 'Rich & Oily',
    bestCookingStyle: 'Stuffed Recheado Fry, Fish Gravy',
    cutOptions: ['Whole Cleaned & Slitted', 'Curry Cut', 'Headless Cleaned'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
    tag: 'Value Catch',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-5',
    name: 'Red Snapper (Rani / Coral Fish)',
    category: 'fish',
    price: 740,
    unit: 'KG',
    rating: 4.8,
    reviewsCount: 74,
    description: 'Sweet pink flesh with tender flakes. Excellent for coal grilling or rich coastal curry.',
    harborOrigin: 'Karwar Reef • Landed 4:50 AM',
    boneType: 'Few Bones',
    texture: 'Delicate & Flaky',
    bestCookingStyle: 'Whole Grilled, Tangy Curry, Tawa Roast',
    cutOptions: ['Whole Cleaned with Diamond Slits', 'Fillet', 'Curry Cut'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    tag: 'Reef Fresh',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-6',
    name: 'Black Pomfret (Halwa)',
    category: 'fish',
    price: 860,
    unit: 'KG',
    rating: 4.8,
    reviewsCount: 110,
    description: 'Rich dark meat with a deep savory flavor profile. Great for pan-frying with thick marinades.',
    harborOrigin: 'Malpe Deep Sea • Landed 5:00 AM',
    boneType: 'Single Center Bone',
    texture: 'Firm & Meaty',
    bestCookingStyle: 'Pan Fry, Spicy Tawa Roast',
    cutOptions: ['Pan Fry Steaks', 'Curry Cut', 'Whole Cleaned'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },

  // Masalas
  {
    id: 'masala-1',
    name: 'Coastal Red Tawa Fry Masala Paste',
    category: 'masala',
    price: 140,
    unit: 'pack',
    rating: 4.9,
    reviewsCount: 340,
    description: 'Stone-ground Byadgi chili paste with tamarind, garlic, ginger & roasted cumin. 250g pack.',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    tag: 'Must Have'
  },
  {
    id: 'masala-2',
    name: 'Goan Recheado Green Chili Masala',
    category: 'masala',
    price: 150,
    unit: 'pack',
    rating: 4.8,
    reviewsCount: 190,
    description: 'Fiery green masala crafted with fresh coriander, green chilies, coconut vinegar & aromatic spices.',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    tag: 'Spicy Delight'
  },
  {
    id: 'masala-3',
    name: 'Kundapur Ghee Roast Masala Paste',
    category: 'masala',
    price: 180,
    unit: 'pack',
    rating: 5.0,
    reviewsCount: 420,
    description: 'Authentic Mangalorean ghee roast paste slow-roasted in pure A2 cow ghee with whole whole spices.',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=800&q=80',
    tag: 'Legendary'
  },

  // Combo Bundles
  {
    id: 'combo-1',
    name: 'Sunday Family Tawa Fry Feast',
    category: 'combo',
    price: 1220,
    unit: 'combo',
    rating: 5.0,
    reviewsCount: 88,
    description: 'Includes 1kg Surmai Steaks + 1 Pack Red Tawa Masala + Complimentary Fresh Lemons & Curry Leaves.',
    isAvailable: true,
    image: './images/surmai.png',
    tag: 'Save ₹70',
    discountPercentage: 10
  },
  {
    id: 'combo-2',
    name: 'Royal Pomfret Ghee Roast Bundle',
    category: 'combo',
    price: 1080,
    unit: 'combo',
    rating: 4.9,
    reviewsCount: 64,
    description: 'Includes 1kg Silver Pomfret + 1 Pack Kundapur Ghee Roast Masala. Restaurant quality at home.',
    isAvailable: true,
    image: './images/pomfret.png',
    tag: 'Save ₹50',
    discountPercentage: 8
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Authentic Malpe Crispy Pomfret Tawa Fry',
    prepTime: '15 mins',
    cookTime: '12 mins',
    difficulty: 'Easy',
    image: './images/pomfret.png',
    pairedFish: 'Silver Pomfret',
    ingredients: [
      '1 KG TAKABATHE Silver Pomfret (Tawa cut)',
      '1 Pack TAKABATHE Coastal Red Tawa Masala',
      '2 tbsp Semolina (Rava) for coating',
      '2 tbsp Coconut oil for pan frying',
      'Lemon wedges & fresh curry leaves'
    ],
    steps: [
      'Wash fish slices gently and pat dry with paper towel.',
      'Generously coat each piece with TAKABATHE Red Tawa Masala and marinate for 20 mins.',
      'Dredge lightly in fine rava for extra crispiness.',
      'Heat coconut oil on a iron tawa over medium flame.',
      'Fry each side for 4-5 minutes until golden red and crisp. Serve hot with lemon!'
    ]
  },
  {
    id: 'rec-2',
    title: 'Kundapur Style Surmai Ghee Roast',
    prepTime: '20 mins',
    cookTime: '15 mins',
    difficulty: 'Chef Special',
    image: './images/surmai.png',
    pairedFish: 'Surmai / Kingfish',
    ingredients: [
      '1 KG TAKABATHE Surmai Steaks',
      '1 Pack TAKABATHE Kundapur Ghee Roast Masala',
      '3 tbsp Pure Cow Ghee',
      '1 tbsp Tamarind pulp',
      'Handful of fried curry leaves'
    ],
    steps: [
      'Marinate Surmai steaks with turmeric, salt, and lemon juice for 15 mins.',
      'Shallow fry fish in 1 tbsp ghee until 80% cooked, set aside.',
      'In the same pan, melt remaining ghee and saute TAKABATHE Ghee Roast Paste until aromatic.',
      'Add fish steaks back to the pan, toss gently to coat in velvety ghee roast masala.',
      'Garnish with crispy fried curry leaves and serve with Neer Dosa or Steamed Rice.'
    ]
  }
];
