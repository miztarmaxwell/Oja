
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary text-light mt-12">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} Oja Marketplace. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-1">A Fictional E-Commerce Platform</p>
            </div>
        </footer>
    );
};
