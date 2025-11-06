import React from 'react';
import { CartItem, User } from '../types';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon } from './icons';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    user: User | null;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onCheckout: () => void;
    onClearCart: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, user, onUpdateQuantity, onCheckout, onClearCart }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 1500 : 0;
    const total = subtotal + deliveryFee;
    const hasSufficientFunds = user ? user.balance >= total : false;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="flex items-baseline gap-4">
                             <h2 className="text-2xl font-bold text-secondary">Your Cart</h2>
                             {cartItems.length > 0 && (
                                <button
                                    onClick={onClearCart}
                                    className="text-sm text-red-600 hover:underline font-semibold transition-colors"
                                    aria-label="Clear all items from cart"
                                >
                                    Clear All
                                </button>
                             )}
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <XMarkIcon className="w-7 h-7" />
                        </button>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0"/>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-secondary">{item.name}</h3>
                                        <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-md hover:bg-gray-100"><MinusIcon className="w-4 h-4" /></button>
                                            <span className="px-4 font-semibold">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-md hover:bg-gray-100"><PlusIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <p className="font-bold text-secondary text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
                                         <button 
                                            onClick={() => onUpdateQuantity(item.id, 0)} 
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title={`Remove ${item.name}`}
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                           <p className="text-lg text-gray-500">Your cart is empty.</p>
                           <p className="text-sm text-gray-400 mt-2">Add items from a store to get started!</p>
                        </div>
                    )}


                    <div className="p-6 border-t bg-gray-50">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₦{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>₦{deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-secondary pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {user && cartItems.length > 0 && (
                            <div className={`p-3 rounded-lg mt-4 text-center ${hasSufficientFunds ? 'bg-green-100' : 'bg-red-100'}`}>
                                <p className={`text-sm font-medium ${hasSufficientFunds ? 'text-green-800' : 'text-red-800'}`}>
                                    Wallet Balance: <span className="font-bold">₦{user.balance.toLocaleString()}</span>
                                </p>
                                {!hasSufficientFunds && (
                                    <p className="text-xs font-semibold text-red-800 mt-1">Insufficient funds for this order.</p>
                                )}
                            </div>
                        )}

                        <button 
                            onClick={onCheckout}
                            disabled={cartItems.length === 0 || (user && !hasSufficientFunds)}
                            className="mt-6 w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                           {user || cartItems.length === 0 ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};