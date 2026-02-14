export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories';
  saved: boolean;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  height: number;
  weight: number;
  avatarUrl: string | null;
}

export interface CartItem {
  id: string;
  clothingItem: ClothingItem;
  quantity: number;
  size: string;
}

export interface ShippingInfo {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface DeliveryOrder {
  id: string;
  status: 'processing' | 'shipped' | 'delivered';
  items: { name: string; size: string; quantity: number }[];
  estimatedDelivery: string;
  trackingNumber: string;
}

export const DUMMY_CLOTHES: ClothingItem[] = [
  { id: '1', name: 'Classic White Tee', brand: 'Essentials', price: 29.99, category: 'tops', saved: false, color: '#F5F5F5' },
  { id: '2', name: 'Slim Fit Jeans', brand: 'Denim Co', price: 89.99, category: 'bottoms', saved: true, color: '#4A6FA5' },
  { id: '3', name: 'Leather Sneakers', brand: 'StepUp', price: 129.99, category: 'shoes', saved: false, color: '#D4A574' },
  { id: '4', name: 'Oversized Hoodie', brand: 'UrbanKnit', price: 59.99, category: 'tops', saved: true, color: '#2D2D2D' },
  { id: '5', name: 'Chino Shorts', brand: 'SummerLine', price: 44.99, category: 'bottoms', saved: false, color: '#C4A882' },
  { id: '6', name: 'Canvas Tote Bag', brand: 'CarryAll', price: 34.99, category: 'accessories', saved: false, color: '#8B7355' },
  { id: '7', name: 'Striped Polo', brand: 'ClassicWear', price: 49.99, category: 'tops', saved: false, color: '#1B4332' },
  { id: '8', name: 'Running Shoes', brand: 'FleetFoot', price: 149.99, category: 'shoes', saved: true, color: '#E63946' },
  { id: '9', name: 'Wool Scarf', brand: 'WinterKnit', price: 39.99, category: 'accessories', saved: false, color: '#BC6C25' },
  { id: '10', name: 'Tailored Trousers', brand: 'FormalEdge', price: 79.99, category: 'bottoms', saved: false, color: '#333333' },
  { id: '11', name: 'Graphic Sweatshirt', brand: 'ArtWear', price: 54.99, category: 'tops', saved: true, color: '#606C38' },
  { id: '12', name: 'Minimalist Watch', brand: 'TimeKeep', price: 199.99, category: 'accessories', saved: false, color: '#CDB4DB' },
];

export const SUGGESTED_CLOTHES: ClothingItem[] = [
  DUMMY_CLOTHES[0],
  DUMMY_CLOTHES[2],
  DUMMY_CLOTHES[6],
  DUMMY_CLOTHES[9],
  DUMMY_CLOTHES[11],
];

export const DUMMY_USER: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@schnell.com',
  height: 175,
  weight: 70,
  avatarUrl: null,
};

export const DUMMY_CART: CartItem[] = [
  { id: 'c1', clothingItem: DUMMY_CLOTHES[1], quantity: 1, size: 'M' },
  { id: 'c2', clothingItem: DUMMY_CLOTHES[3], quantity: 1, size: 'L' },
  { id: 'c3', clothingItem: DUMMY_CLOTHES[7], quantity: 1, size: '42' },
];

export const DUMMY_ORDERS: DeliveryOrder[] = [
  {
    id: 'ORD-001',
    status: 'shipped',
    items: [
      { name: 'Slim Fit Jeans', size: 'M', quantity: 1 },
      { name: 'Oversized Hoodie', size: 'L', quantity: 1 },
    ],
    estimatedDelivery: '2026-02-18',
    trackingNumber: 'TRK-9281734',
  },
  {
    id: 'ORD-002',
    status: 'processing',
    items: [
      { name: 'Running Shoes', size: '42', quantity: 1 },
    ],
    estimatedDelivery: '2026-02-22',
    trackingNumber: 'TRK-1029384',
  },
];

export type ClothingCategory = 'all' | ClothingItem['category'];

export const CATEGORIES: { label: string; value: ClothingCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
];
