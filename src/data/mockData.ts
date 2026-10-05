export interface Product {
  id: string;
  name: string;
  localName?: string; // Optional Kannada/Tulu coastal name (Anjal, Manji, Yetti, etc.)
  category: 'fish' | 'masala' | 'combo';
  price: number; // Price per KG for fish, or per pack for masala
  unit: 'KG' | 'pack' | 'combo';
  rating: number;
  reviewsCount: number;
  description: string;
  harborOrigin?: string;
  boatName?: string;
  freshnessPercent?: number;
  boneType?: 'Single Center Bone' | 'Boneless' | 'Few Bones' | 'Multi-bone';
  texture?: 'Delicate & Flaky' | 'Firm & Meaty' | 'Succulent & Tender' | 'Rich & Oily';
  bestCookingStyle?: string;
  cutOptions?: string[];
  isAvailable: boolean;
  image: string;
  tag?: string;
  discountPercentage?: number;
  weightSteps?: number[];
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
  qty: number;
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
    name: 'Kingfish / Surmai',
    localName: 'Anjal',
    category: 'fish',
    price: 900,
    unit: 'KG',
    rating: 4.9,
    reviewsCount: 218,
    description: 'Thick premium tawa steaks with rich omega-3 oils. Packed on ice at 6 AM, never frozen.',
    harborOrigin: 'Malpe Deep Sea Docks',
    boatName: 'MFV Sea Queen',
    freshnessPercent: 98,
    boneType: 'Single Center Bone',
    texture: 'Firm & Meaty',
    bestCookingStyle: 'Crispy Tawa Fry, Ghee Roast, Fish Biryani',
    cutOptions: ['Fry Cut (Steaks)', 'Curry Cut', 'Boneless Fillet', 'Whole Cleaned'],
    isAvailable: true,
    image: './images/surmai.png',
    tag: 'Bestseller',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-2',
    name: 'Silver Pomfret',
    localName: 'Manji / Paplet',
    category: 'fish',
    price: 950,
    unit: 'KG',
    rating: 5.0,
    reviewsCount: 184,
    description: 'Delicate white meat with single center bone. Scaled and cleaned to order.',
    harborOrigin: 'Mangalore Old Port Docks',
    boatName: 'MFV Coastal Star',
    freshnessPercent: 99,
    boneType: 'Single Center Bone',
    texture: 'Delicate & Flaky',
    bestCookingStyle: 'Pan Fry, Tawa Roast, Malabar Coconut Curry',
    cutOptions: ['Whole Cleaned & Scaled', 'Fry Cut (Steaks)', 'Curry Cut', 'Boneless'],
    isAvailable: true,
    image: './images/pomfret.png',
    tag: "Chef's Choice",
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-3',
    name: 'Jumbo Tiger Prawns',
    localName: 'Yetti',
    category: 'fish',
    price: 550,
    unit: 'KG',
    rating: 4.8,
    reviewsCount: 189,
    description: 'Succulent estuary tiger prawns. De-veined, peeled, and prepped fresh to order.',
    harborOrigin: 'Kundapur Estuary Docks',
    boatName: 'MFV Estuary Pride',
    freshnessPercent: 95,
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
    name: 'Indian Mackerel',
    localName: 'Bangude',
    category: 'fish',
    price: 380,
    unit: 'KG',
    rating: 4.7,
    reviewsCount: 142,
    description: 'High omega-3 coastal classic. Slitted and prepped for fiery stuffed green recheado fry.',
    harborOrigin: 'Honnavar Coastal Dock',
    boatName: 'MFV Ocean Wave',
    freshnessPercent: 96,
    boneType: 'Multi-bone',
    texture: 'Rich & Oily',
    bestCookingStyle: 'Stuffed Recheado Fry, Fish Gravy',
    cutOptions: ['Whole Cleaned & Slitted', 'Curry Cut', 'Fry Cut'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
    tag: 'Daily Classic',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-5',
    name: 'Sardines',
    localName: 'Boothai / Mathi',
    category: 'fish',
    price: 400,
    unit: 'KG',
    rating: 4.6,
    reviewsCount: 94,
    description: 'Super fresh coastal sardines, rich in oils and natural marine minerals.',
    harborOrigin: 'Malpe Harbor Docks',
    boatName: 'MFV Harbor Light',
    freshnessPercent: 94,
    boneType: 'Few Bones',
    texture: 'Rich & Oily',
    bestCookingStyle: 'Rava Fry, Spicy Coconut Curry',
    cutOptions: ['Whole Cleaned & Headless', 'Curry Cut', 'As-is Whole'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    tag: 'Value Catch',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-6',
    name: 'Black Pomfret',
    localName: 'Kari Manji',
    category: 'fish',
    price: 860,
    unit: 'KG',
    rating: 4.8,
    reviewsCount: 110,
    description: 'Rich dark meat with a deep savory flavor profile. Great for pan-frying.',
    harborOrigin: 'Malpe Deep Sea Docks',
    boatName: 'MFV Sea Queen',
    freshnessPercent: 97,
    boneType: 'Single Center Bone',
    texture: 'Firm & Meaty',
    bestCookingStyle: 'Pan Fry, Spicy Tawa Roast',
    cutOptions: ['Fry Cut (Steaks)', 'Curry Cut', 'Whole Cleaned'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-7',
    name: 'Croaker Fish',
    localName: 'Koddar',
    category: 'fish',
    price: 620,
    unit: 'KG',
    rating: 4.6,
    reviewsCount: 68,
    description: 'Tender white flesh, perfect for light curry or pan roast.',
    harborOrigin: 'Kundapur Docks',
    boatName: 'MFV Coastal Pearl',
    freshnessPercent: 92,
    boneType: 'Single Center Bone',
    texture: 'Delicate & Flaky',
    bestCookingStyle: 'Tawa Fry, Kundapur Curry',
    cutOptions: ['Curry Cut', 'Fry Cut', 'Whole Cleaned'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    tag: 'Fresh Dock',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-8',
    name: 'Red Snapper',
    localName: 'Rangu',
    category: 'fish',
    price: 600,
    unit: 'KG',
    rating: 4.8,
    reviewsCount: 74,
    description: 'Sweet pink flesh with tender flakes. Excellent for coal grilling or rich curry.',
    harborOrigin: 'Karwar Reef Docks',
    boatName: 'MFV Reef Rider',
    freshnessPercent: 94,
    boneType: 'Few Bones',
    texture: 'Delicate & Flaky',
    bestCookingStyle: 'Whole Grilled, Tangy Curry',
    cutOptions: ['Whole Cleaned with Slits', 'Boneless Fillet', 'Curry Cut'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    tag: 'Reef Fresh',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },
  {
    id: 'prod-9',
    name: 'Ocean Squid',
    localName: 'Bondas',
    category: 'fish',
    price: 520,
    unit: 'KG',
    rating: 4.5,
    reviewsCount: 52,
    description: 'Fresh ocean squid rings, cleaned and prepped for fiery ghee roast or crispy rings.',
    harborOrigin: 'Malpe Harbor Docks',
    boatName: 'MFV Ocean Wave',
    freshnessPercent: 91,
    boneType: 'Boneless',
    texture: 'Succulent & Tender',
    bestCookingStyle: 'Squid Rings Fry, Ghee Roast, Chilli Squid',
    cutOptions: ['Cleaned Rings', 'Whole Tube Cleaned', 'Whole Uncleaned'],
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    tag: 'Squid Rings',
    weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  },

  // Masalas
  {
    id: 'masala-1',
    name: 'Coastal Red Tawa Fry Masala Paste',
    localName: 'Red Tawa Paste',
    category: 'masala',
    price: 140,
    unit: 'pack',
    rating: 4.9,
    reviewsCount: 340,
    description: 'Stone-ground Byadgi chili paste with tamarind, garlic & roasted cumin. 250g pack.',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    tag: 'Must Have'
  },
  {
    id: 'masala-2',
    name: 'Kundapur Ghee Roast Masala Paste',
    localName: 'Ghee Roast Paste',
    category: 'masala',
    price: 180,
    unit: 'pack',
    rating: 5.0,
    reviewsCount: 420,
    description: 'Authentic Mangalorean ghee roast paste slow-roasted in pure A2 cow ghee.',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=800&q=80',
    tag: 'Legendary'
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Authentic Malpe Crispy Anjal Tawa Fry',
    prepTime: '15 mins',
    cookTime: '12 mins',
    difficulty: 'Easy',
    image: './images/surmai.png',
    pairedFish: 'Kingfish / Surmai',
    ingredients: [
      '1 KG TAKABATHE Anjal (Kingfish Steaks)',
      '1 Pack TAKABATHE Red Tawa Masala',
      '2 tbsp Rava (Semolina) for coating',
      '2 tbsp Coconut oil for pan frying'
    ],
    steps: [
      'Wash Anjal steaks gently and pat dry.',
      'Coat each piece with TAKABATHE Red Tawa Masala and marinate for 20 mins.',
      'Dredge lightly in fine rava for extra crispiness.',
      'Fry on iron tawa in coconut oil for 4-5 mins each side. Serve hot!'
    ]
  }
];
