
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !phone || !licensePlate) {
            alert('Please fill out all fields.');
            return;
        }
        onSubmit({
            fullName,
            phone,
            vehicleType,
            licensePlate,
            isVerified: false,
        });
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-xl p-8">
                 <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary">Complete Your Delivery Profile</h1>
                    <p className="text-gray-500 mt-2">Just a few more details to get you on the road!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            Complete Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};