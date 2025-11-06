import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    totalStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 'md', totalStars = 5 }) => {
    const [hoverRating, setHoverRating] = React.useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const isInteractive = !!onRatingChange;

    return (
        <div className={`flex items-center ${isInteractive ? 'cursor-pointer' : ''}`}>
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                const starRating = isInteractive ? hoverRating || rating : rating;
                
                return (
                    <div
                        key={index}
                        onMouseEnter={isInteractive ? () => setHoverRating(starValue) : undefined}
                        onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
                        onClick={isInteractive ? () => onRatingChange(starValue) : undefined}
                    >
                        <StarIcon
                            className={`${sizeClasses[size]} transition-colors duration-200 ${
                                starValue <= starRating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    </div>
                );
            })}
        </div>
    );
};
