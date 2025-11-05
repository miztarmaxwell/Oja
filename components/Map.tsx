
import React from 'react';
import { TruckIcon, StorefrontIcon, MapPinIcon } from './icons';

interface Coords {
    lat: number;
    lng: number;
}

interface MapProps {
    startCoords: Coords;
    endCoords: Coords;
    currentCoords: Coords;
}

// These bounds are approximate for a map image of Lagos
const MAP_BOUNDS = {
    lat: { max: 6.7, min: 6.4 },
    lng: { max: 3.6, min: 3.1 },
};

const coordsToPercent = (coords: Coords | null) => {
    if (!coords) return { x: 0, y: 0 };
    const latRange = MAP_BOUNDS.lat.max - MAP_BOUNDS.lat.min;
    const lngRange = MAP_BOUNDS.lng.max - MAP_BOUNDS.lng.min;

    const y = ((MAP_BOUNDS.lat.max - coords.lat) / latRange) * 100;
    const x = ((coords.lng - MAP_BOUNDS.lng.min) / lngRange) * 100;

    return { x, y };
};

export const Map: React.FC<MapProps> = ({ startCoords, endCoords, currentCoords }) => {
    const startPos = coordsToPercent(startCoords);
    const endPos = coordsToPercent(endCoords);
    const currentPos = coordsToPercent(currentCoords);

    return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-inner">
            <img src="https://i.imgur.com/v82TzFN.png" alt="Map of Lagos" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0">
                {/* Route Line */}
                <svg width="100%" height="100%" className="absolute inset-0">
                    <line 
                        x1={`${startPos.x}%`} 
                        y1={`${startPos.y}%`}
                        x2={`${endPos.x}%`} 
                        y2={`${endPos.y}%`}
                        stroke="#008751" 
                        strokeWidth="3" 
                        strokeDasharray="5, 5"
                    />
                </svg>

                {/* Start Pin (Store) */}
                <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2" 
                    style={{ left: `${startPos.x}%`, top: `${startPos.y}%` }}
                    title="Pickup Location"
                >
                     <div className="p-1.5 bg-secondary text-white rounded-full shadow-lg">
                        <StorefrontIcon className="w-5 h-5" />
                     </div>
                </div>

                {/* End Pin (Delivery) */}
                <div 
                    className="absolute transform -translate-x-1/2 -translate-y-full" 
                    style={{ left: `${endPos.x}%`, top: `${endPos.y}%` }}
                    title="Delivery Location"
                >
                    <MapPinIcon className="w-8 h-8 text-primary drop-shadow-lg" />
                </div>

                 {/* Truck Icon */}
                <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
                    style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}
                >
                    <div className="p-1.5 bg-white rounded-full shadow-lg">
                         <TruckIcon className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
};
