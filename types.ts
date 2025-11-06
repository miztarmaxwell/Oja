

export enum UserRole {
  Buyer = 'BUYER',
  Seller = 'SELLER',
  Delivery = 'DELIVERY',
  Admin = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  balance: number;
  storeId?: string;
  fullName: string;
  phone: string;
}

export enum VehicleType {
    Motorcycle = 'Motorcycle',
    Car = 'Car',
    Van = 'Van',
}

export interface DeliveryPerson extends User {
    vehicleType: VehicleType;
    licensePlate: string;
    isVerified: boolean;
    nin: string;
    address: string;
    profilePictureUrl: string;
    averageRating: number;
    reviewCount: number;
}

export enum StoreCategory {
    Groceries = 'Groceries',
    Food = 'Food & Drinks',
    Electronics = 'Electronics',
    Books = 'Books',
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  bannerImage: string;
  category: StoreCategory;
  address: string;
  coordinates: { lat: number; lng: number; };
  lowStockThreshold?: number;
  averageRating: number;
  reviewCount: number;
}

export interface Item {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
}

export interface CartItem extends Item {
  quantity: number;
}

export enum OrderStatus {
    Processing = 'Processing',
    OutForDelivery = 'Out for Delivery',
    Delivered = 'Delivered',
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    eta: Date;
    orderDate: Date;
    deliveryAddress: string;
    deliveryCoordinates: { lat: number; lng: number; };
    deliveryPersonId?: string | null;
    buyerName: string;
    buyerPhone: string;
    reviewed?: boolean;
}

export interface Review {
  id: string;
  reviewerId: string;
  targetId: string; // Can be storeId, itemId, or deliveryPersonId
  targetType: 'store' | 'item' | 'delivery';
  rating: number; // 1 to 5
  comment: string;
  date: Date;
}

export interface Notification {
  id: string;
  sellerId: string;
  orderId: string;
  message: string;
  read: boolean;
  timestamp: Date;
}