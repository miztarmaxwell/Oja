import React from 'react';
import { User, UserRole } from '../types';
import { ShoppingBagIcon, UserCircleIcon, StorefrontIcon } from './icons';

interface HeaderProps {
    user: User | null;
    onAuthClick: () => void;
    onLogout: () => void;
    cartItemCount: number;
    onCartClick: () => void;
    onNavigate: (view: 'home' | 'orders' | 'seller_dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onLogout, cartItemCount, onCartClick, onNavigate }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <button onClick={() => onNavigate('home')} className="text-3xl font-bold text-primary">
                            Oja
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                         {user && user.role === UserRole.Buyer && (
                             <button onClick={() => onNavigate('orders')} className="hidden sm:block text-gray-600 hover:text-primary transition-colors">
                                My Orders
                            </button>
                         )}
                         {user && user.role === UserRole.Seller && (
                             <button onClick={() => onNavigate('seller_dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                                <StorefrontIcon className="w-5 h-5"/>
                                <span className="hidden sm:block">My Dashboard</span>
                            </button>
                         )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                               <div className="flex items-center space-x-2">
                                    <UserCircleIcon className="w-8 h-8 text-gray-500" />
                                    <span className="hidden md:inline text-gray-700">{user.email}</span>
                               </div>
                                <button onClick={onLogout} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button onClick={onAuthClick} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-green-700 transition-colors">
                                Sign In / Sign Up
                            </button>
                        )}
                        <button onClick={onCartClick} className="relative text-gray-600 hover:text-primary transition-colors p-2">
                            <ShoppingBagIcon className="w-7 h-7" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};