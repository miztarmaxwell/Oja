
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Store, Item, CartItem, Order, UserRole, OrderStatus, StoreCategory } from './types';
import { MOCK_USERS, MOCK_STORES, MOCK_ITEMS } from './constants';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { StoreCard } from './components/StoreCard';
import { ItemCard } from './components/ItemCard';
import { CartSidebar } from './components/CartSidebar';
import { OrderTracking } from './components/OrderTracking';
import { SellerDashboard } from './components/SellerDashboard';
import { Footer } from './components/Footer';
import { ArrowLeftIcon } from './components/icons';

type View = 'home' | 'store_details' | 'orders' | 'checkout' | 'seller_dashboard';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('home');
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'All'>('All');

    const handleLogin = (email: string, role: UserRole) => {
        let user = MOCK_USERS.find(u => u.email === email && u.role === role);
        if (!user) {
            user = { id: `user-${Date.now()}`, email, role, balance: role === UserRole.Buyer ? 50000 : 0 };
            MOCK_USERS.push(user); // Persist new user
        }
        setCurrentUser(user);
        setIsAuthModalOpen(false);
    };

    const handleCreateStore = (storeData: Omit<Store, 'id' | 'ownerId'>) => {
        if (!currentUser || currentUser.role !== UserRole.Seller) return;

        const newStore: Store = {
            ...storeData,
            id: `store-${Date.now()}`,
            ownerId: currentUser.id,
        };
        MOCK_STORES.push(newStore);

        const updatedUser = { ...currentUser, storeId: newStore.id };
        setCurrentUser(updatedUser);

        const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        if(userIndex !== -1) MOCK_USERS[userIndex] = updatedUser;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('home');
    };

    const handleSelectStore = (store: Store) => {
        setSelectedStore(store);
        setView('store_details');
    };

    const handleAddToCart = (item: Item) => {
        if (item.stock <= 0) {
            alert("This item is out of stock.");
            return;
        }

        if (cart.length > 0 && cart[0].storeId !== item.storeId) {
            alert("You can only order from one store at a time. Please clear your cart first.");
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                if (existingItem.quantity + 1 > item.stock) {
                    alert(`You cannot add more than the available stock of ${item.stock}.`);
                    return prevCart;
                }
                return prevCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
        const itemInStore = MOCK_ITEMS.find(i => i.id === itemId);
        if (!itemInStore) return;

        if (quantity > itemInStore.stock) {
            alert(`You cannot order more than the available stock of ${itemInStore.stock}.`);
            quantity = itemInStore.stock;
        }

        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }
            return prevCart.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );
        });
    };

    const handleCheckout = () => {
        if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = subtotal > 0 ? 1500 : 0;
        const total = subtotal + deliveryFee;

        if (total > currentUser.balance) {
            alert("Insufficient funds in your wallet. Please top up your account.");
            return;
        }

        // Deduct from buyer's wallet
        const updatedUser = { ...currentUser, balance: currentUser.balance - total };
        setCurrentUser(updatedUser);
        const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        if(userIndex !== -1) MOCK_USERS[userIndex] = updatedUser;
        
        // Decrement stock
        cart.forEach(cartItem => {
            const itemIndex = MOCK_ITEMS.findIndex(item => item.id === cartItem.id);
            if (itemIndex !== -1) {
                MOCK_ITEMS[itemIndex].stock -= cartItem.quantity;
            }
        });


        const newOrder: Order = {
            id: `order-${Date.now()}`,
            userId: currentUser.id,
            items: cart,
            total,
            status: OrderStatus.Processing,
            eta: new Date(Date.now() + 60 * 60 * 1000), // 1 hour ETA
            orderDate: new Date(),
        };

        setOrders(prevOrders => [...prevOrders, newOrder]);
        setCart([]);
        setIsCartSidebarOpen(false);
        setView('checkout');

        // Simulate order progression
        const deliveryTimeout = setTimeout(() => {
            setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: OrderStatus.OutForDelivery } : o));
        }, 3000);

        const deliveredTimeout = setTimeout(() => {
            setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: OrderStatus.Delivered } : o));

            // Payout to seller on delivery
            const storeId = newOrder.items[0].storeId;
            const store = MOCK_STORES.find(s => s.id === storeId);
            if (store) {
                const sellerIndex = MOCK_USERS.findIndex(u => u.id === store.ownerId);
                if (sellerIndex !== -1) {
                    const commission = newOrder.total * 0.05; // 5% platform fee
                    const payout = newOrder.total - commission;
                    const seller = MOCK_USERS[sellerIndex];
                    const updatedSeller = {...seller, balance: seller.balance + payout };
                    MOCK_USERS[sellerIndex] = updatedSeller;

                    // If seller is current user, update their state too
                    if (currentUser?.id === updatedSeller.id) {
                        setCurrentUser(updatedSeller);
                    }
                }
            }
        }, 6000);

        return () => {
            clearTimeout(deliveryTimeout);
            clearTimeout(deliveredTimeout);
        }
    };

    const handleNavigate = (targetView: 'home' | 'orders' | 'seller_dashboard') => {
        setView(targetView);
        setSelectedStore(null);
    };

    const filteredStores = useMemo(() => {
        return MOCK_STORES.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const storeItems = useMemo(() => {
        return MOCK_ITEMS.filter(item => item.storeId === selectedStore?.id);
    }, [selectedStore]);
    
    const cartItemCount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const userOrders = useMemo(() => {
        return orders.filter(o => o.userId === currentUser?.id).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
    }, [orders, currentUser]);

    const renderContent = () => {
        switch (view) {
            case 'store_details':
                if (!selectedStore) return null;
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <button onClick={() => setView('home')} className="flex items-center gap-2 text-primary mb-6 font-semibold hover:underline">
                            <ArrowLeftIcon className="w-5 h-5"/>
                            Back to All Stores
                        </button>
                        <div className="mb-8">
                            <img src={selectedStore.bannerImage} alt={selectedStore.name} className="w-full h-64 object-cover rounded-lg shadow-lg"/>
                            <h1 className="text-4xl font-bold text-secondary mt-4">{selectedStore.name}</h1>
                            <p className="text-gray-600 mt-2">{selectedStore.description}</p>
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-6">Items for Sale</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {storeItems.map(item => (
                                <ItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                            ))}
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl font-bold text-secondary mb-6">My Orders</h1>
                         {userOrders.length > 0 ? (
                            <div className="space-y-6">
                                {userOrders.map(order => <OrderTracking key={order.id} order={order} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                <p className="text-lg text-gray-500">You haven't placed any orders yet.</p>
                            </div>
                        )}
                    </div>
                );
            case 'checkout':
                const latestOrder = userOrders[0];
                return (
                     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-primary">Thank You for Your Order!</h1>
                            <p className="text-gray-600 mt-2">Your order is being processed and will be delivered soon.</p>
                        </div>
                        {latestOrder && <OrderTracking order={latestOrder} />}
                         <div className="text-center mt-8">
                            <button onClick={() => setView('home')} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                                Continue Shopping
                            </button>
                         </div>
                    </div>
                );
            case 'seller_dashboard':
                return <SellerDashboard user={currentUser} stores={MOCK_STORES} items={MOCK_ITEMS} onCreateStore={handleCreateStore} />;
            case 'home':
            default:
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="relative bg-primary text-white rounded-lg shadow-xl overflow-hidden mb-12 p-8 md:p-12 text-center">
                            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://picsum.photos/seed/nigerianmarket/1600/600')"}}></div>
                            <div className="relative z-10">
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to Oja Marketplace</h1>
                                <p className="text-lg md:text-xl max-w-2xl mx-auto">Discover the best local stores and products, right at your fingertips.</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Search for a store..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            />
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedCategory === 'All' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    All
                                </button>
                                {Object.values(StoreCategory).map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-secondary mb-6">Our Stores</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredStores.map(store => (
                                <StoreCard key={store.id} store={store} onSelect={() => handleSelectStore(store)} />
                            ))}
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header 
                user={currentUser} 
                onAuthClick={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
                cartItemCount={cartItemCount}
                onCartClick={() => setIsCartSidebarOpen(true)}
                onNavigate={handleNavigate}
            />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <Footer />
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />}
            <CartSidebar 
                isOpen={isCartSidebarOpen} 
                onClose={() => setIsCartSidebarOpen(false)}
                cartItems={cart}
                user={currentUser}
                onUpdateQuantity={handleUpdateCartQuantity}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default App;
