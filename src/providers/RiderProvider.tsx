import {createContext, useEffect, useContext, useState} from 'react';
import { Rider } from '@/types/Rider';

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
        fetch('/rider_image_links.json')
        .then(response => response.json())
        .then(data => setRiderImages([{ team: 'Alle lag', image: null }, ...data]))
        .catch((err) => console.log('Error fetching rider images:', err));

        fetch('/rider_data.json')
        .then(response => response.json())
        .then(data => setGlobalRiders(data))
        .catch((err) => console.log('Error fetching rider data:', err));
    }, []);

    return (
        <RiderContext.Provider value={{ globalRiders, riderImages }}>
            {children}
        </RiderContext.Provider>
    );
}