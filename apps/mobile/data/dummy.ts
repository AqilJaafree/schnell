import { ImageSourcePropType } from 'react-native';

export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories';
  saved: boolean;
  color: string;
  image?: ImageSourcePropType;
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
  { id: '1', name: 'Light Dress Shirt', brand: 'Essentials', price: 49.99, category: 'tops', saved: false, color: '#F5F5F5', image: require('../assets/clothes/top/dressshirtlight.jpg') },
  { id: '2', name: 'Black Dress Shirt', brand: 'Essentials', price: 49.99, category: 'tops', saved: true, color: '#2D2D2D', image: require('../assets/clothes/top/dressshirtblack.jpg') },
  { id: '3', name: 'Blue Stripe Shirt', brand: 'ClassicWear', price: 39.99, category: 'tops', saved: false, color: '#4A6FA5', image: require('../assets/clothes/top/stripeshirtblue.jpeg') },
  { id: '4', name: "Levi's Light Jeans", brand: "Levi's", price: 89.99, category: 'bottoms', saved: true, color: '#A8C4E0', image: require('../assets/clothes/bottom/levis_lightjean.jpg') },
  { id: '5', name: 'Black Denim Jeans', brand: 'Denim Co', price: 79.99, category: 'bottoms', saved: false, color: '#333333', image: require('../assets/clothes/bottom/denimblackjean.jpg') },
  { id: '6', name: 'White Pants', brand: 'SummerLine', price: 59.99, category: 'bottoms', saved: false, color: '#F0F0F0', image: require('../assets/clothes/bottom/whitepants.jpg') },
];

export const SUGGESTED_CLOTHES: ClothingItem[] = [
  DUMMY_CLOTHES[0],
  DUMMY_CLOTHES[2],
  DUMMY_CLOTHES[4],
  DUMMY_CLOTHES[5],
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
  { id: 'c3', clothingItem: DUMMY_CLOTHES[4], quantity: 1, size: '32' },
];

export const DUMMY_ORDERS: DeliveryOrder[] = [
  {
    id: 'ORD-001',
    status: 'shipped',
    items: [
      { name: "Levi's Light Jeans", size: 'L', quantity: 1 },
      { name: 'Black Dress Shirt', size: 'M', quantity: 1 },
    ],
    estimatedDelivery: '2026-02-18',
    trackingNumber: 'TRK-9281734',
  },
  {
    id: 'ORD-002',
    status: 'processing',
    items: [
      { name: 'White Pants', size: '32', quantity: 1 },
    ],
    estimatedDelivery: '2026-02-22',
    trackingNumber: 'TRK-1029384',
  },
];

export const TOPS = DUMMY_CLOTHES.filter((c) => c.category === 'tops');
export const BOTTOMS = DUMMY_CLOTHES.filter((c) => c.category === 'bottoms');

export type ClothingCategory = 'all' | ClothingItem['category'];

export const CATEGORIES: { label: string; value: ClothingCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
];
