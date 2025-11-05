

export enum UserRole {
  Buyer = 'BUYER',
  Seller = 'SELLER',
  Delivery = 'DELIVERY',
}

export interface User {
  id: string;
  email: string;
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
}

export interface Item {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
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
}