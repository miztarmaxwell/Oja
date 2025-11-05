
import React, { useState } from 'react';
import { DeliveryPerson, VehicleType } from '../types';

interface DeliverySignupFormProps {
    onSubmit: (details: Omit<DeliveryPerson, 'id' | 'email' | 'role' | 'balance' | 'storeId'>) => void;
}

export const DeliverySignupForm: React.FC<DeliverySignupFormProps> = ({ onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.Motorcycle);
    const [licensePlate, setLicensePlate] = useState('');
    const [nin, setNin] = useState('');
    const [address, setAddress] = useState('');
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !phone || !licensePlate || !nin || !address || !profilePicturePreview) {
            alert('Please fill out all fields and upload a profile picture.');
            return;
        }
        onSubmit({
            fullName,
            phone,
            vehicleType,
            licensePlate,
            nin,
            address,
            profilePictureUrl: profilePicturePreview, // Using the data URL for simulation
            isVerified: false,
        });
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-xl p-8">
                 <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary">Complete Your Delivery Profile</h1>
                    <p className="text-gray-500 mt-2">Submit your details for verification to get on the road!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                                {profilePicturePreview ? (
                                    <img src={profilePicturePreview} alt="Profile preview" className="h-full w-full object-cover" />
                                ) : (
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </span>
                             <label htmlFor="file-upload" className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Upload a photo</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., Tunde Ednut"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., 08012345678"
                        />
                    </div>

                    <div>
                        <label htmlFor="nin" className="block text-sm font-medium text-gray-700">NIN (National Identification Number)</label>
                        <input
                            id="nin"
                            type="text"
                            value={nin}
                            onChange={e => setNin(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., 12345678901"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Residential Address</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., 123 Allen Avenue, Ikeja, Lagos"
                        />
                    </div>

                    <div>
                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                        <select
                            id="vehicleType"
                            value={vehicleType}
                            onChange={e => setVehicleType(e.target.value as VehicleType)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            {Object.values(VehicleType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate</label>
                        <input
                            id="licensePlate"
                            type="text"
                            value={licensePlate}
                            onChange={e => setLicensePlate(e.target.value.toUpperCase())}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., LGS 123-AB"
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            Submit for Verification
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};