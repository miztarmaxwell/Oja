import React, { useState } from 'react';
import { Item } from '../types';
import { XMarkIcon } from './icons';
import { ImageCropper } from './ImageCropper';

interface EditItemModalProps {
    item: Item;
    onClose: () => void;
    onSave: (updatedItem: Omit<Item, 'id' | 'storeId'>) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose, onSave }) => {
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [price, setPrice] = useState(item.price);
    const [stock, setStock] = useState(String(item.stock));
    const [stockError, setStockError] = useState('');
    const [imagePreview, setImagePreview] = useState<string>(item.image);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStock(value);
        if (value === '' || !/^\d+$/.test(value)) {
            setStockError('Stock must be a whole number (e.g., 0, 1, 2...).');
        } else {
            setStockError('');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || price <= 0 || stock === '' || stockError) {
            alert('Please fill out all fields with valid values.');
            return;
        }
        setIsLoading(true);
        try {
            await onSave({
                name,
                description,
                price,
                image: imagePreview,
                stock: Number(stock),
            });
        } catch (error) {
            console.error("Error updating item:", error);
            alert("There was an error updating the item. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {imageToCrop && (
                <ImageCropper
                    imageSrc={imageToCrop}
                    onCropComplete={(croppedImage) => {
                        setImagePreview(croppedImage);
                        setImageToCrop(null);
                    }}
                    onCancel={() => setImageToCrop(null)}
                    aspectRatio={1}
                />
            )}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-6 text-center">Edit Item</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                            <input
                                id="itemName"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                id="itemDescription"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400"
                            />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (₦)</label>
                                <input
                                    id="itemPrice"
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(Number(e.target.value))}
                                    required
                                    min="0"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400"
                                />
                            </div>
                             <div>
                                <label htmlFor="itemStock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                                <input
                                    id="itemStock"
                                    type="text"
                                    inputMode="numeric"
                                    value={stock}
                                    onChange={handleStockChange}
                                    required
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm dark:bg-slate-700 dark:placeholder-gray-400 ${stockError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-primary focus:border-primary'}`}
                                />
                                {stockError && <p className="text-red-500 text-xs mt-1">{stockError}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Image</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <img src={imagePreview} alt="Item preview" className="h-20 w-20 rounded-md object-cover" />
                                <label htmlFor="item-image-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 py-2 px-3 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600">
                                    <span>Change Image</span>
                                    <input id="item-image-upload" name="item-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !!stockError}
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};