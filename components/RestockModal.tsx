import React, { useState } from 'react';
import { Item } from '../types';
import { XMarkIcon } from './icons';

interface RestockModalProps {
    item: Item;
    onClose: () => void;
    onSave: (newStock: number) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({ item, onClose, onSave }) => {
    const [newStock, setNewStock] = useState(String(item.stock));
    const [error, setError] = useState('');

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewStock(value);
        if (value === '' || !/^\d+$/.test(value)) {
            setError('Stock must be a non-negative whole number.');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (error || newStock === '') return;
        onSave(Number(newStock));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-fade-in-up relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold text-secondary">Restock Item</h3>
                <p className="text-gray-600 mt-2">Update stock for: <span className="font-semibold">{item.name}</span></p>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">Current Stock</label>
                        <input
                            id="currentStock"
                            type="text"
                            disabled
                            value={item.stock}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="newStock" className="block text-sm font-medium text-gray-700">New Stock Quantity</label>
                        <input
                            id="newStock"
                            type="text"
                            inputMode="numeric"
                            value={newStock}
                            onChange={handleStockChange}
                            required
                            autoFocus
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                        />
                         {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!!error || newStock === ''}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Update Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
