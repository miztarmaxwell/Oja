import { User, Store, Item, UserRole } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'buyer@oja.com', role: UserRole.Buyer },
  { id: 'user-2', email: 'seller@oja.com', role: UserRole.Seller, storeId: 'store-1' },
];

export const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    ownerId: 'user-2',
    name: "Mama Chi's Market",
    description: 'Your one-stop shop for fresh yams, vegetables, and local spices.',
    bannerImage: 'https://picsum.photos/seed/store1/1200/400',
  },
  {
    id: 'store-2',
    ownerId: 'user-3',
    name: '9ja Bakes & Bites',
    description: 'Delicious, handcrafted puff-puff, meat pies, and cakes for every occasion.',
    bannerImage: 'https://picsum.photos/seed/store2/1200/400',
  },
  {
    id: 'store-3',
    ownerId: 'user-4',
    name: 'Alaba Tech Plaza',
    description: 'The best deals on phones, accessories, and all your electronic needs.',
    bannerImage: 'https://picsum.photos/seed/store3/1200/400',
  },
   {
    id: 'store-4',
    ownerId: 'user-5',
    name: 'Kada Books',
    description: 'Discover Nigerian authors and stories from across the continent.',
    bannerImage: 'https://picsum.photos/seed/store4/1200/400',
  },
];

export const MOCK_ITEMS: Item[] = [
  // Store 1: Mama Chi's Market
  { id: 'item-1', storeId: 'store-1', name: 'Fresh Yams (5 Tubers)', description: 'Perfect for pounding or boiling.', price: 5990, image: 'https://picsum.photos/seed/item1/400/400' },
  { id: 'item-2', storeId: 'store-1', name: 'Spicy Goat Meat (1kg)', description: 'Freshly cut and ready for your pepper soup.', price: 6500, image: 'https://picsum.photos/seed/item2/400/400' },
  { id: 'item-3', storeId: 'store-1', name: 'Crate of Eggs', description: 'One full crate of large brown eggs.', price: 4250, image: 'https://picsum.photos/seed/item3/400/400' },
  { id: 'item-4', storeId: 'store-1', name: 'Bag of Garri', description: 'Crisp and yellow, perfect for eba or drinking.', price: 3990, image: 'https://picsum.photos/seed/item4/400/400' },

  // Store 2: 9ja Bakes & Bites
  { id: 'item-5', storeId: 'store-2', name: 'Meat Pie (Dozen)', description: 'Flaky, buttery pies with a rich minced meat filling.', price: 3750, image: 'https://picsum.photos/seed/item5/400/400' },
  { id: 'item-6', storeId: 'store-2', name: 'Red Velvet Slices (4)', description: 'Classic red velvet with cream cheese frosting.', price: 4000, image: 'https://picsum.photos/seed/item6/400/400' },
  { id: 'item-7', storeId: 'store-2', name: 'Agege Bread', description: 'Traditional soft and sweet Nigerian bread.', price: 1500, image: 'https://picsum.photos/seed/item7/400/400' },

  // Store 3: Alaba Tech Plaza
  { id: 'item-8', storeId: 'store-3', name: 'Wireless Earbuds', description: 'True wireless earbuds with noise cancellation.', price: 79990, image: 'https://picsum.photos/seed/item8/400/400' },
  { id: 'item-9', storeId: 'store-3', name: 'Smart Watch', description: 'Track your fitness and stay connected on the go.', price: 199000, image: 'https://picsum.photos/seed/item9/400/400' },
  { id: 'item-10', storeId: 'store-3', name: 'Portable Charger', description: '10,000mAh power bank to keep your devices charged.', price: 29500, image: 'https://picsum.photos/seed/item10/400/400' },
  { id: 'item-11', storeId: 'store-3', name: 'RGB Gaming Mouse', description: 'Ergonomic gaming mouse with customizable RGB lighting.', price: 45000, image: 'https://picsum.photos/seed/item11/400/400' },

  // Store 4: Kada Books
  { id: 'item-12', storeId: 'store-4', name: 'Things Fall Apart', description: 'A novel by Chinua Achebe.', price: 15990, image: 'https://picsum.photos/seed/item12/400/400' },
  { id: 'item-13', storeId: 'store-4', name: 'Half of a Yellow Sun', description: 'The award-winning book by Chimamanda Ngozi Adichie.', price: 18000, image: 'https://picsum.photos/seed/item13/400/400' },
];