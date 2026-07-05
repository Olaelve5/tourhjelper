import {createContext, useEffect, useContext, useState} from 'react';
import { Rider } from '@/types/Rider';
import { getRiders } from '@/utils/riderUtils';

interface RiderContextType {
    globalRiders: Rider[] | undefined;
    getRiderById: (id: number) => Rider | undefined;
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
    const [globalRiders, setGlobalRiders] = useState<Rider[] | undefined>(undefined); 

    const getRiderById = (id: number): Rider | undefined => {
        return globalRiders?.find((rider) => rider.id === id);
    }

    useEffect(() => {
        async function fetchRiders() {
            try {
                const riders = await getRiders();
                setGlobalRiders(riders);
            } catch (e) {
                console.error("Error fetching rider data: ", e);
        }}

        fetchRiders();

    }, []);

    return (
        <RiderContext.Provider value={{ globalRiders, getRiderById }}>
            {children}
        </RiderContext.Provider>
    );
}