
import {RefObject, useEffect, useRef} from 'react';

interface SwipeProps {
    ref: RefObject<HTMLElement>;
    onSwipe: (direction: 'left' | 'right') => void;
    touchStartX: number;
    touchStartY: number;
    setTouchStartX: (x: number) => void;
    setTouchStartY: (y: number) => void;
}

export function useSwipe({
    ref,
    onSwipe,
    touchStartX,
    touchStartY,
    setTouchStartX,
    setTouchStartY,
}: SwipeProps) {

    const swipeThreshold = 50;
    const verticalThreshold = 30;
    const scrollYRef = useRef<number>(0);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartX(e.touches[0].clientX);
            setTouchStartY(e.touches[0].clientY);
            scrollYRef.current = window.scrollY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            // Avoid swipe if there was a significant vertical scroll
            if (scrollY !== window.scrollY) return; 

            // Ignore vertical swipes
            if (Math.abs(touchStartY - touchEndY) > verticalThreshold) return;

            // Determine swipe direction
            if (touchStartX - touchEndX > swipeThreshold) {
                onSwipe('left');
            } else if (touchStartX - touchEndX < -swipeThreshold) {
                onSwipe('right');
            }
        };

        const element = ref.current;

        if (element) {
            element.addEventListener('touchstart', handleTouchStart);
            element.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (element) {
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [ref, onSwipe, touchStartX, touchStartY, setTouchStartX, setTouchStartY]);
}