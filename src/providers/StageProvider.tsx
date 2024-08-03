import {createContext, useEffect, useContext, useState} from 'react';
import { PlanStage } from '@/types/PlanStage';
import { usePlanContext } from './PlanProvider';

interface PlanStageContextType {
    activeStage: number;
    setActiveStage: (activeStage: number) => void;
};

// Create the context
export const StageContext = createContext<PlanStageContextType | null>(null);


// Create the hook to access the context
export const useStageContext = () => {
    const context = useContext(StageContext);
    if (!context) {
        throw new Error('usePlanStageContext must be used within a PlanStageProvider');
    }
    return context;
};


// Create the provider
export function StageProvider({ children }: { children: React.ReactNode }) {
    const [activeStage, setActiveStage] = useState<number>(1);

    return (
        <StageContext.Provider value={{
            activeStage, setActiveStage
            }}>
            {children}
        </StageContext.Provider>
    );
}