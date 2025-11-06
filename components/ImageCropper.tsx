import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImageUrl: string) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [crop, setCrop] = useState<Crop>({ x: 10, y: 10, width: 200, height: 200 / (aspectRatio || 1) });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialCrop, setInitialCrop] = useState<Crop>(crop);

    const onImageLoad = () => {
        if (imgRef.current) {
            const { width, height } = imgRef.current.getBoundingClientRect();
            const initialSize = Math.min(width, height) * 0.8;
            const newCrop = {
                width: initialSize,
                height: initialSize / aspectRatio,
                x: (width - initialSize) / 2,
                y: (height - initialSize / aspectRatio) / 2,
            };
            setCrop(newCrop);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, action: 'drag' | 'resize') => {
        e.preventDefault();
        e.stopPropagation();

        if (action === 'drag') setIsDragging(true);
        if (action === 'resize') setIsResizing(true);
        
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialCrop(crop);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging && !isResizing) return;
        if (!imgRef.current) return;

        const { width: imgWidth, height: imgHeight } = imgRef.current.getBoundingClientRect();
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        let newCrop = { ...initialCrop };

        if (isDragging) {
            newCrop.x = initialCrop.x + dx;
            newCrop.y = initialCrop.y + dy;
        } else if (isResizing) {
            newCrop.width = initialCrop.width + dx;
            newCrop.height = newCrop.width / aspectRatio;
        }
        
        // Clamp values to stay within image boundaries
        if (newCrop.width < 50) newCrop.width = 50;
        newCrop.height = newCrop.width / aspectRatio;

        if (newCrop.x < 0) newCrop.x = 0;
        if (newCrop.y < 0) newCrop.y = 0;
        if (newCrop.x + newCrop.width > imgWidth) {
            if (isDragging) newCrop.x = imgWidth - newCrop.width;
            if (isResizing) newCrop.width = imgWidth - newCrop.x;
            newCrop.height = newCrop.width / aspectRatio;
        }
        if (newCrop.y + newCrop.height > imgHeight) {
            if (isDragging) newCrop.y = imgHeight - newCrop.height;
            if (isResizing) { // This can get complex with aspect ratio, simple clamp width instead
                 newCrop.height = imgHeight - newCrop.y;
                 newCrop.width = newCrop.height * aspectRatio;
            }
        }
        
        setCrop(newCrop);

    }, [isDragging, isResizing, dragStart, initialCrop, aspectRatio]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const handleCrop = () => {
        const image = imgRef.current;
        const canvas = canvasRef.current;
        if (!image || !canvas) return;

        const { width: displayWidth, height: displayHeight } = image.getBoundingClientRect();
        const scaleX = image.naturalWidth / displayWidth;
        const scaleY = image.naturalHeight / displayHeight;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        onCropComplete(canvas.toDataURL('image/jpeg', 0.9));
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4" ref={containerRef}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-4 flex flex-col">
                <p className="text-center font-semibold text-lg text-gray-700 mb-4">Crop Your Image</p>
                <div className="relative w-full max-h-[60vh] flex items-center justify-center overflow-hidden">
                    <img
                        ref={imgRef}
                        src={imageSrc}
                        onLoad={onImageLoad}
                        alt="Source for cropping"
                        className="max-w-full max-h-full object-contain"
                    />
                     {imgRef.current && (
                        <>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-50" style={{
                                clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${crop.x}px ${crop.y}px, ${crop.x}px ${crop.y + crop.height}px, ${crop.x + crop.width}px ${crop.y + crop.height}px, ${crop.x + crop.width}px ${crop.y}px, ${crop.x}px ${crop.y}px)`
                            }} />

                            {/* Crop selection */}
                            <div
                                className="absolute border-2 border-dashed border-white cursor-move"
                                style={{
                                    left: crop.x,
                                    top: crop.y,
                                    width: crop.width,
                                    height: crop.height,
                                }}
                                onMouseDown={(e) => handleMouseDown(e, 'drag')}
                            >
                                {/* Resize handle */}
                                <div
                                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-300 cursor-nwse-resize"
                                    onMouseDown={(e) => handleMouseDown(e, 'resize')}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
                    <button onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleCrop} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700">
                        Crop & Save
                    </button>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
