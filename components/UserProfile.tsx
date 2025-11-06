import React from 'react';
import { User, Order, OrderStatus, UserRole } from '../types';
import { UserCircleIcon } from './icons';

interface UserProfileProps {
    user: User | null;
    orders: Order[];
    onLeaveReview: (order: Order) => void;
}

const statusStyles: Record<OrderStatus, string> = {
    [OrderStatus.Processing]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.OutForDelivery]: 'bg-blue-100 text-blue-800',
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
};

export const UserProfile: React.FC<UserProfileProps> = ({ user, orders, onLeaveReview }) => {
    if (!user) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-secondary mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* User Details Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center sticky top-28">
                        <UserCircleIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-secondary">{user.fullName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-gray-500 mt-1">{user.phone}</p>
                         <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-500">Wallet Balance</p>
                            <p className="text-2xl font-bold text-primary">₦{user.balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-secondary mb-4">
                        {user.role === UserRole.Delivery ? 'Delivery History' : 'Order History'}
                    </h2>
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-secondary">Order #{order.id.slice(-6)}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <p className="font-bold text-secondary text-lg">₦{order.total.toLocaleString()}</p>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[order.status]}`}>
                                            {order.status}
                                        </span>
                                         {user.role === UserRole.Buyer && order.status === OrderStatus.Delivered && !order.reviewed && (
                                            <button
                                                onClick={() => onLeaveReview(order)}
                                                className="px-3 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Leave Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <p className="text-gray-500">
                                {user.role === UserRole.Delivery ? 'You have not completed any deliveries yet.' : 'You have not placed any orders yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};