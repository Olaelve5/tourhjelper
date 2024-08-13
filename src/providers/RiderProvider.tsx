import {createContext, useEffect, useContext, useState} from 'react';
import { Rider } from '@/types/Rider';
import { fetchRiderData, fetchRiderImages } from '@/utils/firebase/firebaseRiderUtils';

interface RiderContextType {
    // Define the types for the context
    globalRiders: Rider[] | undefined;
    riderImages: Array<{ team: string; image: string }>;
};


// Create the context
export const RiderContext = createContext<RiderContextType | null>(null);


// Create the hook to access the context
export const useRiderContext = () => {
    const context = useContext(RiderContext);
    if (!context) {
        throw new Error('useRiderContext must be used within a RiderProvider');
    }
    return context;
};


// Create the provider
export function RiderProvider({ children }: { children: React.ReactNode }) {
    const [riderImages, setRiderImages] = useState<Array<{ team: string; image: string }>>([]); 
    const [globalRiders, setGlobalRiders] = useState<Rider[] | undefined>(undefined); 

    useEffect(() => {

        async function fetchImages() {
            const defaultImage = { team: 'Alle lag', image: '' };
            try {
                const images = await fetchRiderImages();
                images.push(defaultImage);
                setRiderImages(images);
            } catch (e) {
                console.error("Error fetching rider images: ", e);
        }}

        async function fetchRiders() {
            try {
                const riders = await fetchRiderData();
                setGlobalRiders(riders);
            } catch (e) {
                console.error("Error fetching rider data: ", e);
        }}

        fetchRiders();
        fetchImages();

    }, []);

    return (
        <RiderContext.Provider value={{ globalRiders, riderImages }}>
            {children}
        </RiderContext.Provider>
    );
}