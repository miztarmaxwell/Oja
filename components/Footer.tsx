
import React from 'react';

interface FooterProps {
    onAdminLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminLoginClick }) => {
    return (
        <footer className="bg-secondary text-light mt-12">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} Oja Marketplace. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-1">A Fictional E-Commerce Platform</p>
                <div className="mt-4">
                    <button onClick={onAdminLoginClick} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        Admin Login
                    </button>
                </div>
            </div>
        </footer>
    );
};