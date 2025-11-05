import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingProps {
    order: Order;
}

const statusMap: Record<OrderStatus, { step: number; label: string }> = {
    [OrderStatus.Processing]: { step: 1, label: 'Processing' },
    [OrderStatus.OutForDelivery]: { step: 2, label: 'Out for Delivery' },
    [OrderStatus.Delivered]: { step: 3, label: 'Delivered' },
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
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
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap justify-between items-start border-b pb-4 mb-4 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-secondary">Order #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">Placed on {formattedOrderDate}</p>
                </div>
                <div className="text-right">
                     <p className="text-lg font-bold text-secondary">₦{order.total.toLocaleString()}</p>
                     <p className="text-sm text-gray-500">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2">Items</h4>
                <div className="space-y-2">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                            <span className="text-gray-800">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Delivery Status: <span className="text-primary">{order.status}</span></h4>
                    {order.status !== OrderStatus.Delivered && (
                        <p className="text-sm text-gray-600 font-medium">ETA: {formattedETA}</p>
                    )}
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Processing</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                </div>
            </div>
        </div>
    );
};