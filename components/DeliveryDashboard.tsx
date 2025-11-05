import React from 'react';
import { DeliveryPerson, Order, OrderStatus, Store } from '../types';
import { MapPinIcon, UserCircleIcon, TruckIcon } from './icons';
import { Map } from './Map';

interface Coords {
    lat: number;
    lng: number;
}

interface DeliveryDashboardProps {
    user: DeliveryPerson;
    orders: Order[];
    stores: Store[];
    onAcceptDelivery: (orderId: string) => void;
    onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
    deliveryLocations: Record<string, Coords>;
}

const DeliveryRequestCard: React.FC<{ order: Order; store: Store | undefined; onAccept: () => void; }> = ({ order, store, onAccept }) => {
    const deliveryFee = 1500; // Hardcoded for now

    return (
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-secondary">New Delivery Request</h3>
                <span className="font-bold text-xl text-primary">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                    <UserCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-700">Customer Details</p>
                        <p className="text-gray-500">{order.buyerName}</p>
                        <p className="text-gray-500">{order.buyerPhone}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-700">Pickup Address</p>
                        <p className="text-gray-500">{store?.name} - {store?.address}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-700">Delivery Address</p>
                        <p className="text-gray-500">{order.deliveryAddress}</p>
                    </div>
                </div>
            </div>
            <button onClick={onAccept} className="mt-5 w-full py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                Accept Delivery
            </button>
        </div>
    );
};

const ActiveDeliveryCard: React.FC<{ order: Order; store: Store | undefined; onMarkDelivered: () => void; deliveryLocation: Coords | null; }> = ({ order, store, onMarkDelivered, deliveryLocation }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-5 border-2 border-primary">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-secondary">Active Delivery</h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${order.status === OrderStatus.Delivered ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'}`}>{order.status}</span>
            </div>
            {store?.coordinates && deliveryLocation && (
                <div className="my-4">
                    <Map startCoords={store.coordinates} endCoords={order.deliveryCoordinates} currentCoords={deliveryLocation}/>
                </div>
            )}
            <div className="mt-4 space-y-3 text-sm">
                 <div className="flex items-start gap-3">
                    <UserCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-700">Customer: {order.buyerName} ({order.buyerPhone})</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-700">Pickup: {store?.name} - {store?.address}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-700">Deliver to: {order.deliveryAddress}</p>
                    </div>
                </div>
            </div>
            {order.status === OrderStatus.OutForDelivery && (
                <button onClick={onMarkDelivered} className="mt-5 w-full py-2.5 bg-green-600 text-white font-semibold rounded-md hover:bg-green-800 transition-colors">
                    Mark as Delivered
                </button>
            )}
             {order.status === OrderStatus.Delivered && (
                <p className="mt-5 text-center font-semibold text-gray-500">Completed!</p>
            )}
        </div>
    );
};

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ user, orders, stores, onAcceptDelivery, onUpdateOrderStatus, deliveryLocations }) => {

    const availableDeliveries = orders.filter(o => o.status === OrderStatus.Processing && !o.deliveryPersonId);
    const myDeliveries = orders.filter(o => o.deliveryPersonId === user.id).sort((a,b) => (a.status === OrderStatus.Delivered ? 1 : -1) - (b.status === OrderStatus.Delivered ? 1 : -1) );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">Delivery Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome, {user.fullName}! Ready to hit the road?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <h2 className="text-2xl font-semibold text-secondary mb-4">My Deliveries ({myDeliveries.length})</h2>
                    <div className="space-y-6">
                        {myDeliveries.length > 0 ? (
                            myDeliveries.map(order => {
                                const store = stores.find(s => s.id === order.items[0]?.storeId);
                                let location = deliveryLocations[order.id] || null;
                                if (order.status === OrderStatus.Delivered && order.deliveryCoordinates) {
                                    location = order.deliveryCoordinates;
                                } else if (!location && order.status === OrderStatus.OutForDelivery && store?.coordinates) {
                                    location = store.coordinates;
                                }
                                
                                return <ActiveDeliveryCard 
                                    key={order.id} 
                                    order={order} 
                                    store={store} 
                                    onMarkDelivered={() => onUpdateOrderStatus(order.id, OrderStatus.Delivered)}
                                    deliveryLocation={location}
                                />;
                            })
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                <p className="text-lg text-gray-500">You have no active deliveries.</p>
                                <p className="text-sm text-gray-400 mt-2">Accept a delivery request to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-secondary mb-4">Available Requests ({availableDeliveries.length})</h2>
                     <div className="space-y-6">
                        {availableDeliveries.length > 0 ? (
                            availableDeliveries.map(order => {
                                const store = stores.find(s => s.id === order.items[0]?.storeId);
                                return <DeliveryRequestCard key={order.id} order={order} store={store} onAccept={() => onAcceptDelivery(order.id)} />;
                            })
                        ) : (
                             <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg text-gray-500">No new delivery requests right now.</p>
                                <p className="text-sm text-gray-400 mt-2">We'll notify you when one comes in!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}