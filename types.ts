
export enum UserRole {
  Buyer = 'BUYER',
  Seller = 'SELLER',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  storeId?: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  bannerImage: string;
}

export interface Item {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
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
}
