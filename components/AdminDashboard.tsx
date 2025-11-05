import React from 'react';
import { DeliveryPerson } from '../types';

interface AdminDashboardProps {
    deliveryPeople: DeliveryPerson[];
    onToggleVerification: (deliveryPersonId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ deliveryPeople, onToggleVerification }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-secondary mb-8">Admin Panel: Delivery Personnel</h1>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deliveryPeople.length > 0 ? deliveryPeople.map((person) => (
                                <tr key={person.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={person.profilePictureUrl} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{person.fullName}</div>
                                                <div className="text-sm text-gray-500">{person.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{person.phone}</div>
                                        <div className="text-sm text-gray-500">NIN: {person.nin}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{person.vehicleType}</div>
                                        <div className="text-sm text-gray-500">{person.licensePlate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {person.isVerified ? (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => onToggleVerification(person.id)}
                                            className={`py-1 px-3 rounded-md text-white font-semibold transition-colors ${
                                                person.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-green-700'
                                            }`}
                                        >
                                            {person.isVerified ? 'Unverify' : 'Verify'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No delivery personnel have signed up yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
