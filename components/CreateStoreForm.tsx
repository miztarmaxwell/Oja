import React, { useState } from 'react';
import { Store, StoreCategory } from '../types';
import { XMarkIcon } from './icons';
import { ImageCropper } from './ImageCropper';

interface CreateStoreFormProps {
    onClose: () => void;
    onCreate: (storeData: Omit<Store, 'id' | 'ownerId' | 'coordinates'>) => Promise<void>;
}

export const CreateStoreForm: React.FC<CreateStoreFormProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // Fix: Corrected enum member from `Groceries` to `Foodstuffs`.
    const [category, setCategory] = useState<StoreCategory>(StoreCategory.Foodstuffs);
    const [address, setAddress] = useState('');
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !address) {
            alert('Please fill out all fields.');
            return;
        }
        setIsLoading(true);
        try {
            // Use the cropped image if available, otherwise generate a default one.
            const bannerImage = bannerPreview || `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/1200/400`;

            await onCreate({
                name,
                description,
                category,
                bannerImage,
                address,
            });
        } catch (error) {
            console.error("Error creating store:", error);
            alert("There was an error creating your store. Please try again.");
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
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Create Your Store</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
                            <input
                                id="storeName"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="e.g., Mama Chi's Market"
                            />
                        </div>

                        <div>
                            <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">Store Description</label>
                            <textarea
                                id="storeDescription"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Tell customers what makes your store special."
                            />
                        </div>

                         <div>
                            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">Store Address</label>
                            <textarea
                                id="storeAddress"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                required
                                rows={2}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="e.g., 15, Ojo Main Market, Ojo, Lagos"
                            />
                        </div>

                        <div>
                            <label htmlFor="storeCategory" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="storeCategory"
                                value={category}
                                onChange={e => setCategory(e.target.value as StoreCategory)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            >
                                {Object.values(StoreCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {bannerPreview ? (
                                        <img src={bannerPreview} alt="Banner preview" className="mx-auto h-24 w-auto rounded-md object-cover" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">A default image will be used if none is provided.</p>
                                </div>
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
                                {isLoading ? 'Creating...' : 'Create Store'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};