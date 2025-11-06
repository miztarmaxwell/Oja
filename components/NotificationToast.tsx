import React, { useEffect } from 'react';
import { Notification } from '../types';
import { XMarkIcon, ShoppingBagIcon } from './icons';

interface NotificationToastProps {
    notification: Notification;
    onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 6000); // 6 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div 
            className="fixed top-24 right-4 sm:right-6 w-full max-w-sm bg-white rounded-lg shadow-2xl p-4 z-[100] animate-slide-in-right"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="p-2 bg-green-100 rounded-full">
                         <ShoppingBagIcon className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-bold text-secondary">New Order Received!</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={onClose}
                        className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
