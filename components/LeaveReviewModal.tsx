import React, { useState } from 'react';
import { Order, Store, DeliveryPerson } from '../types';
import { XMarkIcon } from './icons';
import { StarRating } from './StarRating';

export interface ReviewSubmission {
    storeRating: number;
    storeComment: string;
    itemReviews: {
        [itemId: string]: {
            rating: number;
            comment: string;
        };
    };
    deliveryPersonRating?: number;
    deliveryPersonComment?: string;
}

interface LeaveReviewModalProps {
    order: Order;
    store: Store | undefined;
    deliveryPerson: DeliveryPerson | undefined;
    onClose: () => void;
    onSubmit: (submission: ReviewSubmission) => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({ order, store, deliveryPerson, onClose, onSubmit }) => {
    const [storeRating, setStoreRating] = useState(0);
    const [storeComment, setStoreComment] = useState('');
    const [itemReviews, setItemReviews] = useState<ReviewSubmission['itemReviews']>(() => {
        const initialState: ReviewSubmission['itemReviews'] = {};
        order.items.forEach(item => {
            initialState[item.id] = { rating: 0, comment: '' };
        });
        return initialState;
    });
    const [deliveryPersonRating, setDeliveryPersonRating] = useState(0);
    const [deliveryPersonComment, setDeliveryPersonComment] = useState('');

    const handleItemReviewChange = (itemId: string, field: 'rating' | 'comment', value: number | string) => {
        setItemReviews(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value,
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        // Fix: Explicitly type `r` to resolve a type inference issue with Object.values.
        if (storeRating === 0 || Object.values(itemReviews).some((r: { rating: number; comment: string; }) => r.rating === 0)) {
            alert('Please provide a rating for the store and all items.');
            return;
        }
        if (deliveryPerson && deliveryPersonRating === 0) {
            alert('Please provide a rating for the delivery person.');
            return;
        }
        onSubmit({
            storeRating,
            storeComment,
            itemReviews,
            ...(deliveryPerson && {
                deliveryPersonRating,
                deliveryPersonComment,
            })
        });
    };

    if (!store) return null; // Should not happen if logic is correct

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl relative animate-fade-in-up max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8 border-b dark:border-slate-700">
                     <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 text-center">Leave a Review</h2>
                     <p className="text-center text-gray-500 dark:text-gray-400">Your feedback helps others!</p>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-8 space-y-8">
                        {/* Store Review */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-secondary dark:text-gray-200 mb-3">Review for {store.name}</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                                <StarRating rating={storeRating} onRatingChange={setStoreRating} size="lg" />
                            </div>
                            <div>
                                <label htmlFor="storeComment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Comments (optional)</label>
                                <textarea
                                    id="storeComment"
                                    value={storeComment}
                                    onChange={e => setStoreComment(e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400"
                                    placeholder="How was your experience with this store?"
                                />
                            </div>
                        </div>

                        {/* Delivery Person Review */}
                        {deliveryPerson && (
                            <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-secondary dark:text-gray-200 mb-3">Review for Delivery by {deliveryPerson.fullName}</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                                    <StarRating rating={deliveryPersonRating} onRatingChange={setDeliveryPersonRating} size="lg" />
                                </div>
                                <div>
                                    <label htmlFor="deliveryPersonComment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Comments (optional)</label>
                                    <textarea
                                        id="deliveryPersonComment"
                                        value={deliveryPersonComment}
                                        onChange={e => setDeliveryPersonComment(e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400"
                                        placeholder={`How was the delivery experience with ${deliveryPerson.fullName}?`}
                                    />
                                </div>
                            </div>
                        )}


                        {/* Item Reviews */}
                        <div>
                            <h3 className="text-lg font-semibold text-secondary dark:text-gray-200 mb-3">Review Your Items</h3>
                            <div className="space-y-6">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 border dark:border-slate-700 rounded-lg">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                                        <div className="flex-grow space-y-3">
                                            <p className="font-semibold dark:text-gray-200">{item.name}</p>
                                            <div className="mb-2">
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Your Rating</label>
                                                <StarRating rating={itemReviews[item.id].rating} onRatingChange={(r) => handleItemReviewChange(item.id, 'rating', r)} />
                                            </div>
                                            <div>
                                                 <label htmlFor={`itemComment-${item.id}`} className="block text-xs font-medium text-gray-600 dark:text-gray-400">Your Comments (optional)</label>
                                                 <input
                                                    id={`itemComment-${item.id}`}
                                                    type="text"
                                                    value={itemReviews[item.id].comment}
                                                    onChange={e => handleItemReviewChange(item.id, 'comment', e.target.value)}
                                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400"
                                                    placeholder="What did you think of this item?"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900 sticky bottom-0">
                         <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};