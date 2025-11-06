import React, { useState } from 'react';
import { Store, StoreCategory } from '../types';
import { XMarkIcon } from './icons';
import { ImageCropper } from './ImageCropper';

interface EditStoreModalProps {
    store: Store;
    onClose: () => void;
    onSave: (updatedStoreData: Omit<Store, 'id' | 'ownerId' | 'coordinates' | 'averageRating' | 'reviewCount' | 'lowStockThreshold'>) => void;
}

export const EditStoreModal: React.FC<EditStoreModalProps> = ({ store, onClose, onSave }) => {
    const [name, setName] = useState(store.name);
    const [description, setDescription] = useState(store.description);
    const [category, setCategory] = useState<StoreCategory>(store.category);
    const [address, setAddress] = useState(store.address);
    const [bannerPreview, setBannerPreview] = useState<string>(store.bannerImage);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageToCrop(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !address) return;
        setIsLoading(true);
        try {
            await onSave({
                name,
                description,
                category,
                bannerImage: bannerPreview,
                address,
            });
            onClose();
        } catch (error) {
            console.error("Error updating store:", error);
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
                        setBannerPreview(croppedImage);
                        setImageToCrop(null);
                    }}
                    onCancel={() => setImageToCrop(null)}
                    aspectRatio={3}
                />
            )}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Edit Store Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
                            <input id="storeName" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">Store Description</label>
                            <textarea id="storeDescription" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">Store Address</label>
                            <textarea id="storeAddress" value={address} onChange={e => setAddress(e.target.value)} required rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="storeCategory" className="block text-sm font-medium text-gray-700">Category</label>
                            <select id="storeCategory" value={category} onChange={e => setCategory(e.target.value as StoreCategory)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                {Object.values(StoreCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <img src={bannerPreview} alt="Banner preview" className="h-16 w-48 rounded-md object-cover bg-gray-100 border" />
                                <label htmlFor="banner-upload" className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <span>Change Banner</span>
                                    <input id="banner-upload" name="banner-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                            <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 disabled:bg-gray-400">
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
