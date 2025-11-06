import React from 'react';
import { Item } from '../types';
import { PlusIcon, StarIcon } from './icons';

interface ItemCardProps {
    item: Item;
    onAddToCart: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart }) => {
    const isOutOfStock = item.stock === 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden flex flex-col group">
            <div className="relative h-48">
                <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 py-2 bg-gray-800 bg-opacity-70 rounded-md">Out of Stock</span>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-secondary dark:text-gray-200 flex-grow">{item.name}</h3>
                {item.reviewCount > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({item.reviewCount})</span>
                    </div>
                )}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-xl font-bold text-primary">₦{item.price.toLocaleString()}</p>
                    <button 
                        onClick={() => onAddToCart(item)}
                        disabled={isOutOfStock}
                        className="p-2 bg-green-100 text-primary rounded-full hover:bg-primary hover:text-white transform group-hover:scale-110 transition-all duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none dark:bg-primary/20 dark:text-green-300 dark:hover:bg-primary dark:hover:text-white dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};