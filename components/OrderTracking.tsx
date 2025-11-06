import React from 'react';
import { Order, OrderStatus } from '../types';
import { Map } from './Map';

interface OrderTrackingProps {
    order: Order;
    storeCoordinates: { lat: number, lng: number } | null;
    deliveryLocation: { lat: number, lng: number } | null;
}

const statusMap: Record<OrderStatus, { step: number; label: string }> = {
    [OrderStatus.Processing]: { step: 1, label: 'Processing' },
    [OrderStatus.OutForDelivery]: { step: 2, label: 'Out for Delivery' },
    [OrderStatus.Delivered]: { step: 3, label: 'Delivered' },
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order, storeCoordinates, deliveryLocation }) => {
    const currentStatus = statusMap[order.status];
    const progressPercentage = ((currentStatus.step - 1) / (Object.keys(statusMap).length - 1)) * 100;

    const formattedETA = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(order.eta);

    const formattedOrderDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(order.orderDate)


    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex flex-wrap justify-between items-start border-b dark:border-slate-700 pb-4 mb-4 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-secondary dark:text-gray-200">Order #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {formattedOrderDate}</p>
                </div>
                <div className="text-right">
                     <p className="text-lg font-bold text-secondary dark:text-gray-200">₦{order.total.toLocaleString()}</p>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">Items</h4>
                <div className="space-y-2">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{item.name} <span className="text-gray-400 dark:text-gray-500">x{item.quantity}</span></span>
                            <span className="text-gray-800 dark:text-gray-300">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300">Delivery Status: <span className="text-primary">{order.status}</span></h4>
                    {order.status !== OrderStatus.Delivered && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">ETA: {formattedETA}</p>
                    )}
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Processing</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                </div>
            </div>
            {order.status !== OrderStatus.Processing && storeCoordinates && deliveryLocation && order.deliveryCoordinates && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">Live Tracking</h4>
                    <Map
                        startCoords={storeCoordinates}
                        endCoords={order.deliveryCoordinates}
                        currentCoords={deliveryLocation}
                    />
                </div>
            )}
        </div>
    );
};