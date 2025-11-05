
import React from 'react';
import { Store } from '../types';

interface StoreCardProps {
    store: Store;
    onSelect: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onSelect }) => {
    return (
        <div 
            onClick={onSelect} 
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
            <div className="relative h-40">
                <img className="w-full h-full object-cover" src={store.bannerImage} alt={store.name} />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors duration-300">{store.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{store.description}</p>
            </div>
        </div>
    );
};
