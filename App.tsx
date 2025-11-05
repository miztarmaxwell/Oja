import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Store, Item, CartItem, Order, UserRole, OrderStatus } from './types';
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

type View = 'home' | 'store' | 'orders' | 'seller_dashboard';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('home');
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [stores] = useState<Store[]>(MOCK_STORES);
    const [items] = useState<Item[]>(MOCK_ITEMS);

    const handleLogin = (email: string, role: UserRole) => {
        const user = MOCK_USERS.find(u => u.email === email && u.role === role);
        if (user) {
            setCurrentUser(user);
            setAuthModalOpen(false);
            setCart([]);
            setOrders([]);
        } else {
            // In a real app, you'd show an error.
            // For this mock, we'll auto-create a user.
            const newUser: User = { id: `user-${Date.now()}`, email, role };
            if (role === UserRole.Seller) {
                 // In a real app, store creation would be a separate step
                 newUser.storeId = `store-${Date.now()}`;
            }
            setCurrentUser(newUser);
            setAuthModalOpen(false);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('home');
        setCart([]);
        setOrders([]);
    };


    const handleAddToCart = (item: Item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        setCartOpen(true);
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
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
        if (!currentUser || cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 1500; // ₦1500 delivery fee

        const newOrder: Order = {
            id: `order-${Date.now()}`,
            userId: currentUser.id,
            items: cart,
            total,
            status: OrderStatus.Processing,
            eta: new Date(Date.now() + (30 + Math.random() * 30) * 60000), // ETA in 30-60 mins
            orderDate: new Date(),
        };

        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        setCartOpen(false);
        setCurrentView('orders');
    };

    const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
    }, []);

    useEffect(() => {
        const activeOrders = orders.filter(o => o.status !== OrderStatus.Delivered);
        if (activeOrders.length === 0) return;

        // FIX: The return type of `setTimeout` in the browser is `number`, not `NodeJS.Timeout`.
        // Using `ReturnType<typeof setTimeout>` correctly infers this type.
        const timers: ReturnType<typeof setTimeout>[] = [];
        activeOrders.forEach(order => {
            if (order.status === OrderStatus.Processing) {
                const timer1 = setTimeout(() => {
                    updateOrderStatus(order.id, OrderStatus.OutForDelivery);
                }, 15 * 1000); // 15 seconds to "Out for Delivery"
                timers.push(timer1);

                const timer2 = setTimeout(() => {
                    updateOrderStatus(order.id, OrderStatus.Delivered);
                }, 45 * 1000); // 45 seconds to "Delivered"
                timers.push(timer2);
            } else if (order.status === OrderStatus.OutForDelivery) {
                 const timer = setTimeout(() => {
                    updateOrderStatus(order.id, OrderStatus.Delivered);
                }, 30 * 1000); // 30 seconds more to "Delivered"
                timers.push(timer);
            }
        });

        return () => timers.forEach(clearTimeout);
    }, [orders, updateOrderStatus]);


    const selectedStore = useMemo(() => {
        return stores.find(s => s.id === selectedStoreId);
    }, [selectedStoreId, stores]);

    const storeItems = useMemo(() => {
        return items.filter(i => i.storeId === selectedStoreId);
    }, [selectedStoreId, items]);
    
    const renderContent = () => {
        switch (currentView) {
            case 'store':
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <button onClick={() => setCurrentView('home')} className="mb-6 inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                            Back to All Stores
                        </button>
                        {selectedStore && (
                           <>
                             <div className="relative rounded-lg overflow-hidden h-48 md:h-64 mb-8">
                                <img src={selectedStore.bannerImage} alt={selectedStore.name} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white">{selectedStore.name}</h1>
                                    <p className="text-lg text-gray-200 mt-1">{selectedStore.description}</p>
                                </div>
                             </div>
                             <h2 className="text-2xl font-bold text-secondary mb-6">Items for sale</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {storeItems.map(item => (
                                    <ItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                                ))}
                            </div>
                           </>
                        )}
                    </div>
                );
            case 'orders':
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl font-bold text-secondary mb-8">My Orders</h1>
                        {orders.length > 0 ? (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <OrderTracking key={order.id} order={order} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg shadow-md">
                                <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                                <button onClick={() => setCurrentView('home')} className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition-colors">
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'seller_dashboard':
                 return <SellerDashboard user={currentUser} stores={stores} items={items}/>
            case 'home':
            default:
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-lg mb-12" style={{backgroundImage: "url('https://picsum.photos/seed/lagosmarket/1200/300')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                           <div className="bg-black bg-opacity-50 rounded-lg p-8 inline-block">
                             <h1 className="text-4xl md:text-5xl font-extrabold text-white">Welcome to Oja</h1>
                             <p className="text-xl text-gray-200 mt-4">Your local marketplace, delivered.</p>
                           </div>
                        </div>
                        <h2 className="text-3xl font-bold text-secondary mb-8">Featured Stores</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stores.map(store => (
                                <StoreCard key={store.id} store={store} onSelect={() => {
                                    setSelectedStoreId(store.id);
                                    setCurrentView('store');
                                }} />
                            ))}
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-secondary">
           <Header
                user={currentUser}
                onAuthClick={() => setAuthModalOpen(true)}
                onLogout={handleLogout}
                cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)}
                onCartClick={() => setCartOpen(true)}
                onNavigate={setCurrentView}
            />

            <main className="flex-grow">
                {renderContent()}
            </main>

            <Footer />

            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => setAuthModalOpen(false)}
                    onLogin={handleLogin}
                />
            )}
            
            <CartSidebar 
                isOpen={isCartOpen}
                onClose={() => setCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default App;