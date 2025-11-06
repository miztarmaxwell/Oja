import React, { useState } from 'react';
import { Item } from '../types';
import { XMarkIcon } from './icons';

interface EditItemModalProps {
    item: Item;
    onClose: () => void;
    onSave: (updatedItem: Omit<Item, 'id' | 'storeId'>) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose, onSave }) => {
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [price, setPrice] = useState(item.price);
    const [imagePreview, setImagePreview] = useState<string>(item.image);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || price <= 0) {
            alert('Please fill out all fields with valid values.');
            return;
        }
        setIsLoading(true);
        try {
            // In a real app, if a new file is uploaded, this would involve uploading to a service
            // and getting a new URL. Here, we'll just pass the data URL or the original URL.
            await onSave({
                name,
                description,
                price,
                image: imagePreview,
                // stock isn't editable in this form, so we pass it along
                stock: item.stock,
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
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Edit Item</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
                            <input
                                id="itemName"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="itemDescription"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">Price (₦)</label>
                            <input
                                id="itemPrice"
                                type="number"
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                required
                                min="0"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Image</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <img src={imagePreview} alt="Item preview" className="h-20 w-20 rounded-md object-cover" />
                                <label htmlFor="item-image-upload" className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <span>Change Image</span>
                                    <input id="item-image-upload" name="item-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
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