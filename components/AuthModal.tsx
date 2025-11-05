
import React, { useState } from 'react';
import { UserRole } from '../types';
import { XMarkIcon } from './icons';

interface AuthModalProps {
    onClose: () => void;
    onLogin: (email: string, role: UserRole) => void;
}

type AuthMode = 'signin' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Buyer);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }
        onLogin(email, role);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <div className="flex border-b mb-6">
                        <button 
                            onClick={() => setMode('signin')}
                            className={`flex-1 py-3 text-lg font-semibold transition-colors ${mode === 'signin' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-3 text-lg font-semibold transition-colors ${mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-secondary mb-2">{mode === 'signin' ? 'Welcome Back!' : 'Create an Account'}</h2>
                    <p className="text-center text-gray-500 mb-6">{mode === 'signin' ? 'Sign in to continue' : 'Join Oja today'}</p>
                    
                    {mode === 'signup' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setRole(UserRole.Buyer)} className={`flex-1 py-3 px-4 border rounded-md text-sm transition-all ${role === UserRole.Buyer ? 'bg-green-100 border-primary text-primary font-semibold' : 'bg-gray-50'}`}>
                                    Buyer
                                </button>
                                <button type="button" onClick={() => setRole(UserRole.Seller)} className={`flex-1 py-3 px-4 border rounded-md text-sm transition-all ${role === UserRole.Seller ? 'bg-green-100 border-primary text-primary font-semibold' : 'bg-gray-50'}`}>
                                    Seller
                                </button>
                                <button type="button" onClick={() => setRole(UserRole.Delivery)} className={`flex-1 py-3 px-4 border rounded-md text-sm transition-all ${role === UserRole.Delivery ? 'bg-green-100 border-primary text-primary font-semibold' : 'bg-gray-50'}`}>
                                    Delivery
                                </button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
