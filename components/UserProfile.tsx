import React from 'react';
import { User, Order, OrderStatus, UserRole, DeliveryPerson } from '../types';
import { UserCircleIcon, StarIcon } from './icons';

interface UserProfileProps {
    user: User | null;
    orders: Order[];
    onLeaveReview: (order: Order) => void;
}

const statusStyles: Record<OrderStatus, string> = {
    [OrderStatus.Processing]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [OrderStatus.OutForDelivery]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
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
            <h1 className="text-3xl font-bold text-secondary dark:text-gray-200 mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* User Details Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center sticky top-28">
                        <UserCircleIcon className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-secondary dark:text-gray-200">{user.fullName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{user.phone}</p>
                        {user.role === UserRole.Delivery && (user as DeliveryPerson).reviewCount > 0 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <StarIcon className="w-5 h-5 text-yellow-400" />
                                <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{(user as DeliveryPerson).averageRating.toFixed(1)}</span>
                                <span className="text-gray-500 dark:text-gray-400">({(user as DeliveryPerson).reviewCount} reviews)</span>
                            </div>
                        )}
                         <div className="mt-4 pt-4 border-t dark:border-slate-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</p>
                            <p className="text-2xl font-bold text-primary">₦{user.balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-secondary dark:text-gray-200 mb-4">
                        {user.role === UserRole.Delivery ? 'Delivery History' : 'Order History'}
                    </h2>
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-secondary dark:text-gray-200">Order #{order.id.slice(-6)}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <p className="font-bold text-secondary dark:text-gray-200 text-lg">₦{order.total.toLocaleString()}</p>
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
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                {user.role === UserRole.Delivery ? 'You have not completed any deliveries yet.' : 'You have not placed any orders yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};