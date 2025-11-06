import { User, Store, Item, UserRole, StoreCategory, DeliveryPerson } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'buyer@oja.com', password: 'password123', role: UserRole.Buyer, balance: 150000, fullName: 'Bayo Adekunle', phone: '08098765432' },
  { id: 'user-2', email: 'seller@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-1', balance: 25000, fullName: 'Chidinma Okoro', phone: '08011223344' },
  { id: 'admin-1', email: 'admin@gmail.com', password: 'admin', role: UserRole.Admin, balance: 0, fullName: 'Admin User', phone: '08000000000' },
  { id: 'user-3', email: 'yaba@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-2', balance: 10000, fullName: 'Segun Wire', phone: '08022334455' },
  { id: 'user-4', email: 'okrika@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-3', balance: 15000, fullName: 'Blessing Okafor', phone: '08033445566' },
  { id: 'user-5', email: 'mile12@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-4', balance: 30000, fullName: 'Musa Aliyu', phone: '08044556677' },
  { id: 'user-6', email: 'fish@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-5', balance: 45000, fullName: 'Iya Ibeji', phone: '08055667788' },
  { id: 'user-7', email: 'vintage@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-6', balance: 12000, fullName: 'Funke Akindele', phone: '08066778899' },
  { id: 'user-8', email: 'grains@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-7', balance: 50000, fullName: 'Hassan Bello', phone: '08077889900' },
  { id: 'user-9', email: 'fits@oja.com', password: 'password123', role: UserRole.Seller, storeId: 'store-8', balance: 9000, fullName: 'KC Brown', phone: '08088990011' },
];

export const MOCK_DELIVERY_PEOPLE: DeliveryPerson[] = [];

export const MOCK_STORES: Store[] = [
  // Foodstuffs Stores
  {
    id: 'store-1',
    ownerId: 'user-2',
    name: "Mama Chi's Market",
    description: 'Your one-stop shop for fresh yams, vegetables, and local spices.',
    bannerImage: 'https://picsum.photos/seed/store1/1200/400',
    category: StoreCategory.Foodstuffs,
    address: '15, Ojo Main Market, Ojo, Lagos',
    coordinates: { lat: 6.46, lng: 3.18 },
    lowStockThreshold: 5,
    averageRating: 0,
    reviewCount: 0,
  },
  {
    id: 'store-4',
    ownerId: 'user-5',
    name: 'Mile 12 Fresh Produce',
    description: 'Direct from the farm. The freshest tomatoes, peppers, and leafy greens.',
    bannerImage: 'https://picsum.photos/seed/store4/1200/400',
    category: StoreCategory.Foodstuffs,
    address: 'Shop 101, Mile 12 Market, Ketu, Lagos',
    coordinates: { lat: 6.58, lng: 3.39 },
    lowStockThreshold: 10,
    averageRating: 0,
    reviewCount: 0,
  },
  {
    id: 'store-5',
    ownerId: 'user-6',
    name: 'Olojo Fish Market',
    description: 'The best of the sea. Fresh fish, smoked fish, snails, and crabs.',
    bannerImage: 'https://picsum.photos/seed/store5/1200/400',
    category: StoreCategory.Foodstuffs,
    address: 'Stall 23, Olojo Drive Fish Market, Ojo, Lagos',
    coordinates: { lat: 6.465, lng: 3.185 },
    lowStockThreshold: 5,
    averageRating: 0,
    reviewCount: 0,
  },
  {
    id: 'store-7',
    ownerId: 'user-8',
    name: "Aboki's Grains & Oils",
    description: 'Bulk rice, beans, garri, and quality cooking oils at great prices.',
    bannerImage: 'https://picsum.photos/seed/store7/1200/400',
    category: StoreCategory.Foodstuffs,
    address: '7, Daleko Market, Isolo, Lagos',
    coordinates: { lat: 6.53, lng: 3.31 },
    lowStockThreshold: 3,
    averageRating: 0,
    reviewCount: 0,
  },
  // Thrift Clothing Stores
  {
    id: 'store-2',
    ownerId: 'user-3',
    name: 'YabaLeft Wears',
    description: 'The trendiest thrift finds from jackets to jeans. Look sharp, save money.',
    bannerImage: 'https://picsum.photos/seed/store2/1200/400',
    category: StoreCategory.ThriftClothing,
    address: 'Under the bridge, Yaba, Lagos',
    coordinates: { lat: 6.51, lng: 3.38 },
    lowStockThreshold: 2,
    averageRating: 0,
    reviewCount: 0,
  },
  {
    id: 'store-3',
    ownerId: 'user-4',
    name: 'Okrika Selects',
    description: 'Curated second-hand fashion for women. Quality dresses, blouses, and trousers.',
    bannerImage: 'https://picsum.photos/seed/store3/1200/400',
    category: StoreCategory.ThriftClothing,
    address: 'Aswani Market, Isolo, Lagos',
    coordinates: { lat: 6.54, lng: 3.30 },
    lowStockThreshold: 2,
    averageRating: 0,
    reviewCount: 0,
  },
  {
    id: 'store-6',
    ownerId: 'user-7',
    name: "Aunty Funke's Vintage",
    description: 'Classic and timeless female clothing. From skirts to beautiful shoes.',
    bannerImage: 'https://picsum.photos/seed/store6/1200/400',
    category: StoreCategory.ThriftClothing,
    address: 'Shop 12, Tejuosho Market, Yaba, Lagos',
    coordinates: { lat: 6.515, lng: 3.375 },
    lowStockThreshold: 1,
    averageRating: 0,
    reviewCount: 0,
  },
  {
    id: 'store-8',
    ownerId: 'user-9',
    name: "Bros K's Okrika Fits",
    description: 'Quality thrift wear for men. Find shirts, trousers, and boxers.',
    bannerImage: 'https://picsum.photos/seed/store8/1200/400',
    category: StoreCategory.ThriftClothing,
    address: 'Katangua Market, Abule Egba, Lagos',
    coordinates: { lat: 6.66, lng: 3.31 },
    lowStockThreshold: 3,
    averageRating: 0,
    reviewCount: 0,
  },
];

export const MOCK_ITEMS: Item[] = [
  // Store 1: Mama Chi's Market (Foodstuffs)
  { id: 'item-1', storeId: 'store-1', name: 'Fresh Yams (5 Tubers)', description: 'Perfect for pounding or boiling.', price: 5990, image: 'https://picsum.photos/seed/item1/400/400', stock: 50, averageRating: 0, reviewCount: 0 },
  { id: 'item-2', storeId: 'store-1', name: 'Spicy Goat Meat (1kg)', description: 'Freshly cut and ready for your pepper soup.', price: 6500, image: 'https://picsum.photos/seed/item2/400/400', stock: 30, averageRating: 0, reviewCount: 0 },
  { id: 'item-3', storeId: 'store-1', name: 'Palm Oil (1 Litre)', description: 'Rich, red, and unadulterated palm oil.', price: 2500, image: 'https://picsum.photos/seed/item3/400/400', stock: 100, averageRating: 0, reviewCount: 0 },
  { id: 'item-4', storeId: 'store-1', name: 'Fresh Ugu Leaves (Bunch)', description: 'A bundle of fresh pumpkin leaves for your soups.', price: 500, image: 'https://picsum.photos/seed/item4/400/400', stock: 80, averageRating: 0, reviewCount: 0 },

  // Store 4: Mile 12 Fresh Produce (Foodstuffs)
  { id: 'item-5', storeId: 'store-4', name: 'Basket of Tomatoes', description: 'A small basket of ripe, red tomatoes.', price: 3500, image: 'https://picsum.photos/seed/item5/400/400', stock: 40, averageRating: 0, reviewCount: 0 },
  { id: 'item-6', storeId: 'store-4', name: 'Bag of Red Peppers (Tatase)', description: 'A small bag of fresh bell peppers.', price: 1500, image: 'https://picsum.photos/seed/item6/400/400', stock: 60, averageRating: 0, reviewCount: 0 },
  { id: 'item-7', storeId: 'store-4', name: 'Ripe Plantain (Bunch)', description: 'A hand of sweet, ripe plantain for frying.', price: 2000, image: 'https://picsum.photos/seed/item7/400/400', stock: 50, averageRating: 0, reviewCount: 0 },

  // Store 5: Olojo Fish Market (Foodstuffs)
  { id: 'item-8', storeId: 'store-5', name: 'Fresh Tilapia (Medium)', description: 'One medium-sized fresh Tilapia, cleaned.', price: 3000, image: 'https://picsum.photos/seed/item8/400/400', stock: 25, averageRating: 0, reviewCount: 0 },
  { id: 'item-9', storeId: 'store-5', name: 'Smoked Catfish (Eja Kika)', description: 'A pair of large, well-smoked catfish.', price: 4500, image: 'https://picsum.photos/seed/item9/400/400', stock: 40, averageRating: 0, reviewCount: 0 },
  { id: 'item-10', storeId: 'store-5', name: 'Live Snails (5)', description: 'Five large, live African snails.', price: 5000, image: 'https://picsum.photos/seed/item10/400/400', stock: 15, averageRating: 0, reviewCount: 0 },

  // Store 7: Aboki's Grains & Oils (Foodstuffs)
  { id: 'item-11', storeId: 'store-7', name: 'Rice (5kg Bag)', description: 'A bag of Nigerian long-grain parboiled rice.', price: 8500, image: 'https://picsum.photos/seed/item11/400/400', stock: 100, averageRating: 0, reviewCount: 0 },
  { id: 'item-12', storeId: 'store-7', name: 'Brown Beans (Oloyin)', description: 'A 3kg bag of sweet honey beans.', price: 4200, image: 'https://picsum.photos/seed/item12/400/400', stock: 120, averageRating: 0, reviewCount: 0 },
  { id: 'item-13', storeId: 'store-7', name: 'Yellow Garri (Ijebu)', description: 'A 5kg bag of crispy yellow cassava flakes.', price: 3800, image: 'https://picsum.photos/seed/item13/400/400', stock: 90, averageRating: 0, reviewCount: 0 },

  // Store 2: YabaLeft Wears (Thrift Clothing)
  { id: 'item-14', storeId: 'store-2', name: 'Vintage Denim Jacket', description: 'A classic 90s style denim jacket.', price: 7500, image: 'https://picsum.photos/seed/item14/400/400', stock: 5, averageRating: 0, reviewCount: 0 },
  { id: 'item-15', storeId: 'store-2', name: 'Graphic T-Shirt', description: 'Comfortable cotton t-shirt with a retro print.', price: 3000, image: 'https://picsum.photos/seed/item15/400/400', stock: 10, averageRating: 0, reviewCount: 0 },
  { id: 'item-16', storeId: 'store-2', name: 'Male Cargo Shorts', description: 'Durable multi-pocket cargo shorts.', price: 4000, image: 'https://picsum.photos/seed/item16/400/400', stock: 8, averageRating: 0, reviewCount: 0 },
  
  // Store 3: Okrika Selects (Thrift Clothing)
  { id: 'item-17', storeId: 'store-3', name: 'Female High-Waist Jeans', description: 'Flattering mom-jean style, light wash.', price: 5500, image: 'https://picsum.photos/seed/item17/400/400', stock: 7, averageRating: 0, reviewCount: 0 },
  { id: 'item-18', storeId: 'store-3', name: 'Floral Summer Dress', description: 'A light and airy dress, perfect for the heat.', price: 6000, image: 'https://picsum.photos/seed/item18/400/400', stock: 4, averageRating: 0, reviewCount: 0 },
  { id: 'item-19', storeId: 'store-3', name: 'Leather Crossbody Bag', description: 'A small, genuine leather bag in tan.', price: 8000, image: 'https://picsum.photos/seed/item19/400/400', stock: 3, averageRating: 0, reviewCount: 0 },

  // Store 6: Aunty Funke's Vintage (Thrift Clothing)
  { id: 'item-20', storeId: 'store-6', name: 'Vintage Silk Blouse', description: 'An elegant long-sleeve silk blouse.', price: 4500, image: 'https://picsum.photos/seed/item20/400/400', stock: 6, averageRating: 0, reviewCount: 0 },
  { id: 'item-21', storeId: 'store-6', name: 'Pleated A-line Skirt', description: 'A knee-length pleated skirt in navy blue.', price: 5000, image: 'https://picsum.photos/seed/item21/400/400', stock: 5, averageRating: 0, reviewCount: 0 },
  { id: 'item-22', storeId: 'store-6', name: 'Classic Female Loafers', description: 'Comfortable leather shoes for work or casual wear.', price: 7000, image: 'https://picsum.photos/seed/item22/400/400', stock: 4, averageRating: 0, reviewCount: 0 },

  // Store 8: Bros K's Okrika Fits (Thrift Clothing)
  { id: 'item-23', storeId: 'store-8', name: "Men's Checkered Shirt", description: 'A long-sleeve formal shirt in excellent condition.', price: 3500, image: 'https://picsum.photos/seed/item23/400/400', stock: 12, averageRating: 0, reviewCount: 0 },
  { id: 'item-24', storeId: 'store-8', name: 'Pack of Singlets (3)', description: 'Three white cotton athletic vests.', price: 2500, image: 'https://picsum.photos/seed/item24/400/400', stock: 20, averageRating: 0, reviewCount: 0 },
  { id: 'item-25', storeId: 'store-8', name: 'Plain Black Trousers', description: 'Slightly used formal trousers for men.', price: 4000, image: 'https://picsum.photos/seed/item25/400/400', stock: 9, averageRating: 0, reviewCount: 0 },
];