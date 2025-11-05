import React, { useMemo } from 'react';
import { User, Store, Item } from '../types';

interface SellerDashboardProps {
    user: User | null;
    stores: Store[];
    items: Item[];
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, stores, items }) => {
    
    const myStore = useMemo(() => {
        return stores.find(s => s.id === user?.storeId);
    }, [user, stores]);

    const myItems = useMemo(() => {
        return items.filter(i => i.storeId === user?.storeId);
    }, [user, items]);

    // In a real app, these would come from actual orders
    const completedSales = [
        { id: 'sale-1', total: 45500, date: '2023-10-26' },
        { id: 'sale-2', total: 120000, date: '2023-10-25' },
        { id: 'sale-3', total: 22750, date: '2023-10-24' },
    ];

    if (!user || !myStore) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl text-red-500">Access Denied</h1>
                <p>You must be a registered seller to view this page.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">Seller Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome back, {user.email}!</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Store and Items */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Store Info */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-secondary mb-4">My Store</h2>
                        <div className="flex items-center space-x-6">
                            <img src={myStore.bannerImage} alt={myStore.name} className="w-32 h-20 rounded-md object-cover"/>
                            <div>
                                <h3 className="text-xl font-bold">{myStore.name}</h3>
                                <p className="text-gray-500">{myStore.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Items List */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-2xl font-semibold text-secondary">My Items ({myItems.length})</h2>
                           <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">
                            Add New Item
                           </button>
                        </div>
                        <div className="space-y-4">
                            {myItems.map(item => (
                                <div key={item.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-secondary">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-primary">₦{item.price.toLocaleString()}</p>
                                        <button className="text-xs text-blue-500 hover:underline mt-1">Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Payouts */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-2xl font-semibold text-secondary mb-4">Wallet &amp; Payouts</h2>
                    <div className="bg-green-50 p-4 rounded-lg text-center mb-6">
                        <p className="text-sm text-green-700">Current Balance</p>
                        <p className="text-3xl font-bold text-green-900">₦{user.balance.toLocaleString()}</p>
                    </div>
                    <button className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">
                        Withdraw Funds
                     </button>
                    <h3 className="font-semibold my-4 pt-4 border-t">Recent Sales</h3>
                     <div className="space-y-3">
                        {completedSales.map(sale => (
                           <div key={sale.id} className="flex justify-between items-center text-sm border-b pb-2">
                             <div>
                                <p className="text-gray-700">Sale #{sale.id.slice(-4)}</p>
                                <p className="text-xs text-gray-400">{sale.date}</p>
                             </div>
                             <p className="font-semibold text-green-600">+₦{sale.total.toLocaleString()}</p>
                           </div>
                        ))}
                     </div>
                     <button className="mt-6 w-full py-2 border border-primary text-primary text-sm font-semibold rounded-md hover:bg-green-50 transition-colors">
                        View Transaction History
                     </button>
                </div>
            </div>
        </div>
    );
};