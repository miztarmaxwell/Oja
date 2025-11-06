
import React from 'react';
import { Store } from '../types';
import { StarIcon } from './icons';

interface StoreCardProps {
    store: Store;
    onSelect: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onSelect }) => {
    return (
        <div 
            onClick={onSelect} 
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
            <div className="relative h-40">
                <img className="w-full h-full object-cover" src={store.bannerImage} alt={store.name} />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-secondary dark:text-gray-200 group-hover:text-primary transition-colors duration-300">{store.name}</h3>
                 {store.reviewCount > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{store.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({store.reviewCount} reviews)</span>
                    </div>
                )}
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{store.description}</p>
            </div>
        </div>
    );
};