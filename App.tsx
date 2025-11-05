import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Store, Item, CartItem, Order, UserRole, OrderStatus, StoreCategory, DeliveryPerson } from './types';
import { MOCK_USERS, MOCK_STORES, MOCK_ITEMS, MOCK_DELIVERY_PEOPLE } from './constants';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { StoreCard } from './components/StoreCard';
import { ItemCard } from './components/ItemCard';
import { CartSidebar } from './components/CartSidebar';
import { OrderTracking } from './components/OrderTracking';
import { SellerDashboard } from './components/SellerDashboard';
import { DeliverySignupForm } from './components/DeliverySignupForm';
import { Footer } from './components/Footer';
import { ArrowLeftIcon } from './components/icons';
import { DeliveryDashboard } from './components/DeliveryDashboard';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { GoogleGenAI } from '@google/genai';

type View = 'home' | 'store_details' | 'orders' | 'checkout' | 'seller_dashboard' | 'delivery_signup' | 'delivery_dashboard' | 'profile' | 'admin_dashboard';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | DeliveryPerson | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
    const [view, setView] = useState<View>('home');
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'All'>('All');
    const [pendingDeliveryUser, setPendingDeliveryUser] = useState<User | null>(null);
    const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>(MOCK_DELIVERY_PEOPLE);
    const [deliverySimulations, setDeliverySimulations] = useState<Record<string, { progress: number }>>({});
    const [stores, setStores] = useState(MOCK_STORES);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                    // Fallback location (e.g., center of Lagos) if permission denied
                    setUserLocation({ lat: 6.5244, lng: 3.3792 });
                }
            );
        } else {
            // Fallback for browsers that don't support geolocation
            setUserLocation({ lat: 6.5244, lng: 3.3792 });
        }
    }, []);


    const handleAuth = (email: string, role: UserRole, mode: 'signin' | 'signup') => {
        if (role === UserRole.Admin && mode === 'signup') {
            alert('Admin accounts cannot be created from the signup form.');
            return;
        }

        if (role === UserRole.Delivery) {
            const deliveryPerson = deliveryPeople.find(u => u.email === email);
            const pendingUser = users.find(u => u.email === email && u.role === UserRole.Delivery);

            if (mode === 'signup') {
                if (deliveryPerson || pendingUser) {
                    alert('An account with this email already exists. Please sign in.');
                    return;
                }
                const newUser: User = { id: `user-${Date.now()}`, email, role, balance: 0, fullName: 'New User', phone: 'N/A' };
                setUsers(prev => [...prev, newUser]);
                setPendingDeliveryUser(newUser);
                setView('delivery_signup');
                setIsAuthModalOpen(false);
            } else { // mode === 'signin'
                if (deliveryPerson) {
                    setCurrentUser(deliveryPerson);
                    setView('delivery_dashboard');
                    setIsAuthModalOpen(false);
                    return;
                }
                if (pendingUser) {
                    setPendingDeliveryUser(pendingUser);
                    setView('delivery_signup');
                    setIsAuthModalOpen(false);
                    return;
                }
                alert('No delivery account found with this email. Please sign up first.');
            }
        } else { // Buyer, Seller or Admin
            const existingUser = users.find(u => u.email === email);

            if (mode === 'signup') {
                if (existingUser) {
                    alert('An account with this email already exists. Please sign in.');
                    return;
                }
                const balance = role === UserRole.Buyer ? 50000 : 0;
                const newUser: User = { id: `user-${Date.now()}`, email, role, balance, fullName: 'New User', phone: 'N/A' };
                setUsers(prev => [...prev, newUser]);
                setCurrentUser(newUser);
                setView('home');
                setIsAuthModalOpen(false);
            } else { // mode === 'signin'
                if (existingUser && existingUser.role === role) {
                    setCurrentUser(existingUser);
                    if (role === UserRole.Seller) {
                        setView('seller_dashboard');
                    } else if (role === UserRole.Admin) {
                        setView('admin_dashboard');
                    } else {
                        setView('home');
                    }
                    setIsAuthModalOpen(false);
                } else {
                    alert('Invalid credentials or role mismatch. Please try again or sign up.');
                }
            }
        }
    };

    const handleCompleteDeliverySignup = (details: Omit<DeliveryPerson, keyof User | 'id'>) => {
        if (!pendingDeliveryUser) return;

        const newDeliveryPerson: DeliveryPerson = {
            ...pendingDeliveryUser,
            ...details,
            isVerified: false, 
        };
        
        setDeliveryPeople(prev => [...prev, newDeliveryPerson]);
        
        setUsers(prev => prev.filter(u => u.id !== pendingDeliveryUser.id));

        setCurrentUser(newDeliveryPerson);
        setPendingDeliveryUser(null);
        setView('delivery_dashboard'); 
    };

     const handleToggleVerification = (deliveryPersonId: string) => {
        setDeliveryPeople(prev =>
            prev.map(person =>
                person.id === deliveryPersonId
                    ? { ...person, isVerified: !person.isVerified }
                    : person
            )
        );
    };

    const handleCreateStore = async (storeData: Omit<Store, 'id' | 'ownerId' | 'coordinates'>) => {
        if (!currentUser || currentUser.role !== UserRole.Seller) return;

        let coordinates = { lat: 6.52 + (Math.random() - 0.5) * 0.1, lng: 3.37 + (Math.random() - 0.5) * 0.1 };
        let geocoded = false;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Find the precise latitude and longitude for this address: "${storeData.address}". Respond with ONLY a valid JSON object in the format {"lat": number, "lng": number}. Do not add any other text or markdown formatting. If you cannot find the address, respond with {"error": "not found"}.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    tools: [{googleMaps: {}}],
                    toolConfig: userLocation ? {
                        retrievalConfig: {
                            latLng: {
                                latitude: userLocation.lat,
                                longitude: userLocation.lng
                            }
                        }
                    } : undefined,
                }
            });

            const resultText = response.text.trim();
            const parsedResult = JSON.parse(resultText);

            if (parsedResult.lat && parsedResult.lng) {
                coordinates = { lat: parsedResult.lat, lng: parsedResult.lng };
                geocoded = true;
            }
        } catch (error) {
            console.error("Geocoding failed:", error);
        }

        if (!geocoded) {
            alert("We couldn't find the exact coordinates for this address. A nearby location has been assigned. You can edit this later.");
        }

        const newStore: Store = {
            ...storeData,
            id: `store-${Date.now()}`,
            ownerId: currentUser.id,
            coordinates,
            lowStockThreshold: 5,
        };
        setStores(prevStores => [...prevStores, newStore]);

        const updatedUser = { ...currentUser, storeId: newStore.id };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser as User : u));
    };

    const handleUpdateStockThreshold = (storeId: string, newThreshold: number) => {
        setStores(prevStores => 
            prevStores.map(s => 
                s.id === storeId ? { ...s, lowStockThreshold: newThreshold } : s
            )
        );
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
        const itemInStore = items.find(i => i.id === itemId);
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

        const updatedUser = { ...currentUser, balance: currentUser.balance - total };
        setCurrentUser(updatedUser);
        if (updatedUser.role !== UserRole.Delivery) {
            setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser as User : u));
        }

        setItems(prevItems => {
            const newItems = [...prevItems];
            cart.forEach(cartItem => {
                const itemIndex = newItems.findIndex(item => item.id === cartItem.id);
                if (itemIndex !== -1) {
                    const currentItem = newItems[itemIndex];
                    newItems[itemIndex] = { ...currentItem, stock: currentItem.stock - cartItem.quantity };
                }
            });
            return newItems;
        });

        const newOrder: Order = {
            id: `order-${Date.now()}`,
            userId: currentUser.id,
            items: cart,
            total,
            status: OrderStatus.Processing,
            eta: new Date(Date.now() + 60 * 60 * 1000), // 1 hour ETA
            orderDate: new Date(),
            deliveryAddress: '10 Bode Thomas Street, Surulere, Lagos', // Mock delivery address
            deliveryCoordinates: { lat: 6.50, lng: 3.35 }, // Mock delivery coordinates
            deliveryPersonId: null,
            buyerName: currentUser.fullName,
            buyerPhone: currentUser.phone,
        };

        setOrders(prevOrders => [...prevOrders, newOrder]);
        setCart([]);
        setIsCartSidebarOpen(false);
        setView('checkout');
    };

     const handleAcceptDelivery = (orderId: string) => {
        if (!currentUser || currentUser.role !== UserRole.Delivery) return;
        const orderToUpdate = orders.find(o => o.id === orderId);
        if (!orderToUpdate) return;
        
        setOrders(prevOrders => prevOrders.map(o => 
            o.id === orderId ? { ...o, deliveryPersonId: currentUser.id, status: OrderStatus.OutForDelivery } : o
        ));

        setDeliverySimulations(prev => ({...prev, [orderId]: { progress: 0 }}));
    };

    const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
        if (!currentUser || (currentUser.role !== UserRole.Delivery && currentUser.role !== UserRole.Seller)) return;

        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        setOrders(prevOrders => prevOrders.map(o => 
            o.id === orderId ? { ...o, status: status } : o
        ));

        if (status === OrderStatus.Delivered) {
            // Payout logic
            const storeId = order.items[0].storeId;
            const store = stores.find(s => s.id === storeId);
            if (store) {
                 setUsers(prevUsers => prevUsers.map(u => {
                    if (u.id === store.ownerId) {
                        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                        const commission = subtotal * 0.05; // 5% platform fee on items
                        const payout = subtotal - commission;
                        return { ...u, balance: u.balance + payout };
                    }
                    return u;
                }));
            }
            
            // Pay the delivery person
            const deliveryFee = 1500; // Assuming fixed fee
            setDeliveryPeople(prevPeople => prevPeople.map(d => {
                if (d.id === order.deliveryPersonId) {
                    return { ...d, balance: d.balance + deliveryFee };
                }
                return d;
            }));

            if (currentUser.id === order.deliveryPersonId) {
                setCurrentUser(prev => prev ? {...prev, balance: prev.balance + deliveryFee } : null);
            }
        }
    };


    const handleNavigate = (targetView: 'home' | 'orders' | 'seller_dashboard' | 'delivery_dashboard' | 'profile' | 'admin_dashboard') => {
        setView(targetView);
        setSelectedStore(null);
    };

    const filteredStores = useMemo(() => {
        return stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, stores]);

    const storeItems = useMemo(() => {
        return items.filter(item => item.storeId === selectedStore?.id);
    }, [selectedStore, items]);
    
    const cartItemCount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const userOrders = useMemo(() => {
        return orders.filter(o => o.userId === currentUser?.id).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
    }, [orders, currentUser]);

    // Effect for running delivery simulations
    useEffect(() => {
        const interval = setInterval(() => {
            setDeliverySimulations(prev => {
                const newSimulations = { ...prev };
                let changed = false;
                Object.keys(newSimulations).forEach(orderId => {
                    const order = orders.find(o => o.id === orderId);
                    if (!order || order.status !== OrderStatus.OutForDelivery) {
                        delete newSimulations[orderId];
                        changed = true;
                        return;
                    }
                    
                    if (newSimulations[orderId].progress < 1) {
                        newSimulations[orderId].progress = Math.min(1, newSimulations[orderId].progress + 0.04);
                        changed = true;
                    }
                });
                return changed ? newSimulations : prev;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [orders]);
    
    const deliveryLocations = useMemo(() => {
        const locations: Record<string, { lat: number, lng: number }> = {};
        Object.keys(deliverySimulations).forEach(orderId => {
            const order = orders.find(o => o.id === orderId);
            const store = stores.find(s => s.id === order?.items[0]?.storeId);
            if (order && store?.coordinates && order.deliveryCoordinates) {
                const { progress } = deliverySimulations[orderId];
                const startCoords = store.coordinates;
                const endCoords = order.deliveryCoordinates;
                
                const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * progress;
                const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * progress;
                
                locations[orderId] = { lat, lng };
            }
        });
        return locations;
    }, [deliverySimulations, orders, stores]);


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
                                {userOrders.map(order => {
                                    const store = stores.find(s => s.id === order.items[0]?.storeId);
                                    let location = deliveryLocations[order.id] || null;
                                    if (order.status === OrderStatus.Delivered && order.deliveryCoordinates) {
                                        location = order.deliveryCoordinates;
                                    } else if (!location && order.status === OrderStatus.OutForDelivery && store?.coordinates) {
                                        location = store.coordinates;
                                    }

                                    return (
                                        <OrderTracking 
                                            key={order.id} 
                                            order={order} 
                                            storeCoordinates={store?.coordinates || null}
                                            deliveryLocation={location}
                                        />
                                    );
                                })}
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
                        {latestOrder && <OrderTracking order={latestOrder} storeCoordinates={null} deliveryLocation={null} />}
                         <div className="text-center mt-8">
                            <button onClick={() => setView('home')} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                                Continue Shopping
                            </button>
                         </div>
                    </div>
                );
            case 'seller_dashboard':
                return <SellerDashboard user={currentUser} stores={stores} items={items} onCreateStore={handleCreateStore} onUpdateStockThreshold={handleUpdateStockThreshold} />;
            case 'delivery_signup':
                return <DeliverySignupForm onSubmit={handleCompleteDeliverySignup} />;
            case 'delivery_dashboard':
                 if (currentUser?.role !== UserRole.Delivery) {
                     return <div className="p-8 text-center"><p>Access Denied.</p><button onClick={() => setView('home')}>Go Home</button></div>;
                 }
                return <DeliveryDashboard user={currentUser as DeliveryPerson} orders={orders} stores={stores} onAcceptDelivery={handleAcceptDelivery} onUpdateOrderStatus={handleUpdateOrderStatus} deliveryLocations={deliveryLocations} />;
            case 'admin_dashboard':
                 if (currentUser?.role !== UserRole.Admin) {
                     return <div className="p-8 text-center"><p>Access Denied.</p><button onClick={() => setView('home')}>Go Home</button></div>;
                 }
                return <AdminDashboard deliveryPeople={deliveryPeople} onToggleVerification={handleToggleVerification} />;
            case 'profile':
                return <UserProfile user={currentUser} orders={userOrders} />;
            case 'home':
            default:
                 if (currentUser?.role === UserRole.Delivery) {
                    return <DeliveryDashboard user={currentUser as DeliveryPerson} orders={orders} stores={stores} onAcceptDelivery={handleAcceptDelivery} onUpdateOrderStatus={handleUpdateOrderStatus} deliveryLocations={deliveryLocations}/>;
                }
                 if (currentUser?.role === UserRole.Admin) {
                    return <AdminDashboard deliveryPeople={deliveryPeople} onToggleVerification={handleToggleVerification} />;
                }
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
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onAuth={handleAuth} />}
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