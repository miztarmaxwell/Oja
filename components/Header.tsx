import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Notification } from '../types';
import { ShoppingBagIcon, UserCircleIcon, StorefrontIcon, TruckIcon, ChevronDownIcon, ShieldCheckIcon, BellIcon, SunIcon, MoonIcon } from './icons';

type Theme = 'light' | 'dark';

interface HeaderProps {
    user: User | null;
    onAuthClick: () => void;
    onLogout: () => void;
    cartItemCount: number;
    onCartClick: () => void;
    onNavigate: (view: 'home' | 'orders' | 'seller_dashboard' | 'delivery_dashboard' | 'profile' | 'admin_dashboard') => void;
    notifications: Notification[];
    onMarkNotificationsAsRead: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onLogout, cartItemCount, onCartClick, onNavigate, notifications, onMarkNotificationsAsRead, theme, setTheme }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
             if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuRef, notificationsRef]);

    const sellerNotifications = user
        ? notifications.filter(n => n.sellerId === user.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        : [];
    const unreadCount = sellerNotifications.filter(n => !n.read).length;

    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <button onClick={() => onNavigate(user?.role === UserRole.Delivery ? 'delivery_dashboard' : user?.role === UserRole.Admin ? 'admin_dashboard' : 'home')} className="text-3xl font-bold text-primary">
                            Oja
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                         {user && user.role === UserRole.Buyer && (
                             <button onClick={() => onNavigate('orders')} className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                My Orders
                            </button>
                         )}
                         {user && user.role === UserRole.Seller && (
                             <button onClick={() => onNavigate('seller_dashboard')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                <StorefrontIcon className="w-5 h-5"/>
                                <span className="hidden sm:block">My Dashboard</span>
                            </button>
                         )}
                         {user && user.role === UserRole.Delivery && (
                             <button onClick={() => onNavigate('delivery_dashboard')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                <TruckIcon className="w-5 h-5"/>
                                <span className="hidden sm:block">My Deliveries</span>
                            </button>
                         )}
                         {user && user.role === UserRole.Admin && (
                             <button onClick={() => onNavigate('admin_dashboard')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                <ShieldCheckIcon className="w-5 h-5"/>
                                <span className="hidden sm:block">Admin Panel</span>
                            </button>
                         )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.role === UserRole.Seller && (
                                    <div className="relative" ref={notificationsRef}>
                                        <button
                                            onClick={() => {
                                                setIsNotificationsOpen(prev => !prev);
                                                if (!isNotificationsOpen && unreadCount > 0) {
                                                    onMarkNotificationsAsRead();
                                                }
                                            }}
                                            className="relative text-gray-600 dark:text-gray-300 hover:text-primary transition-colors p-2"
                                            aria-label={`Notifications (${unreadCount} unread)`}
                                        >
                                            <BellIcon className="w-7 h-7" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                        {isNotificationsOpen && (
                                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-md shadow-lg z-50 border dark:border-slate-600 max-h-96 overflow-y-auto animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                                                <div className="p-3 font-bold border-b dark:border-slate-600 text-secondary dark:text-gray-200">Notifications</div>
                                                {sellerNotifications.length > 0 ? (
                                                    <div>
                                                        {sellerNotifications.map(n => (
                                                            <div key={n.id} className="p-3 border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 last:border-b-0">
                                                                <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{formatTimeAgo(n.timestamp)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">You're all caught up!</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                               
                                <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50 dark:bg-primary/20 border border-green-200 dark:border-primary/30">
                                  <span className="font-semibold text-sm text-primary dark:text-green-300">Wallet:</span>
                                  <span className="font-bold text-secondary dark:text-light">₦{user.balance.toLocaleString()}</span>
                                </div>
                               <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
                                        <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300 hidden md:block">{user.email}</span>
                                        <ChevronDownIcon className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border dark:border-slate-600">
                                            <button 
                                                onClick={() => { onNavigate('profile'); setIsProfileMenuOpen(false); }} 
                                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                                            >
                                                <UserCircleIcon className="w-5 h-5" />
                                                My Profile
                                            </button>
                                            <button 
                                                onClick={onLogout} 
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button onClick={onAuthClick} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-green-700 transition-colors">
                                Sign In / Sign Up
                            </button>
                        )}
                        {user?.role !== UserRole.Delivery && user?.role !== UserRole.Admin && user?.role !== UserRole.Seller && (
                            <button onClick={onCartClick} className="relative text-gray-600 dark:text-gray-300 hover:text-primary transition-colors p-2">
                                <ShoppingBagIcon className="w-7 h-7" />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        )}
                         <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors p-2" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};