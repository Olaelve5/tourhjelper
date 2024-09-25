import React, {createContext, useEffect, useContext, useState, use} from "react";
import { validateUpdate } from "@/utils/MapHelpers";
import { Rider } from "@/types/Rider";
import { calculateTransferDifference } from "@/utils/MapHelpers";
import { useStageContext } from "./StageProvider";
import { usePlanContext } from "./PlanProvider";


// Define the types for the context
interface TeamContextType {
    activeTeam: Rider[];
    setActiveTeam: (riders: Rider[]) => void;
    savedTeam: Rider[];
    setSavedTeam: (riders: Rider[]) => void;
    addRider: (rider: Rider) => void;
    removeRider: (rider: Rider) => void;
    budget: number;
    setBudget: (budget: number) => void;
    transfers: number;
    setSavedTransfers: (transfers: number) => void;
}

// Create the context
export const TeamContext = createContext<TeamContextType | null>(null);

// Create the hook to access the context
export const useTeamContext = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('usePlannerContext must be used within a MapProvider');
    }
    return context;
};


// Create the provider
export function TeamProvider({ children }: { children?: React.ReactNode }) {
    const { activeStage, setActiveStage } = useStageContext();
    const { selectedPlanId, plans } = usePlanContext();
    const [activeTeam, setActiveTeam] = useState<Rider[]>([]);
    const [savedTeam, setSavedTeam] = useState<Rider[]>([]);
    const [budget, setBudget] = useState<number>(100);
    const [transfers, setTransfers] = useState<number>(0);
    const [savedTransfers, setSavedTransfers] = useState<number>(0);
    
    const addRider = (rider: Rider) => {
        
        if (validateUpdate(activeTeam, rider)) {
            const riderToRemoveIndex = activeTeam.findIndex(r => r.category === rider.category && r.undefined);

            if (riderToRemoveIndex !== -1) {
                const newActiveTeam = [...activeTeam];
                rider.undefined = false;
                newActiveTeam[riderToRemoveIndex] = rider;
                setActiveTeam(newActiveTeam); 
            } else {
                const newActiveTeam = [...activeTeam];
                rider.undefined = false;
                newActiveTeam.push(rider);
                setActiveTeam(newActiveTeam); 
            }
        }
    };

    const removeRider = (rider: Rider) => {
        const riderToUpdate = activeTeam.find(r => r.name === rider.name && r.team === rider.team);
        if (!riderToUpdate) return;
        riderToUpdate.undefined = true;
        setActiveTeam([...activeTeam]);
    };

    // Update the budget when the active team changes
    useEffect(() => {
        const activeRiders = activeTeam.filter(r => !r.undefined);
        const totalRiderPrice = activeRiders.reduce((acc, rider) => acc + rider.price, 0);
        const newBudget = 100 - totalRiderPrice;
        setBudget(Math.round(newBudget * 100) / 100);
    }, [activeTeam]);
    
    // Update the transfers when the active team changes
    useEffect(() => {
        const difference = calculateTransferDifference(savedTeam, activeTeam);
        setTransfers(savedTransfers + difference);
    }, [activeTeam]);
    

    // Update the active team when the selected plan or active stage changes
    useEffect(() => {
        if (!selectedPlanId || !activeStage) return;
    
        const stageData = plans.find(plan => plan.id === selectedPlanId)?.stages.find(s => s.stage === activeStage);
    
        if (!stageData) {
            let stageData;
            for (let i = activeStage; i > 0; i--) {
                stageData = plans.find(plan => plan.id === selectedPlanId)?.stages.find(s => s.stage === i);
                if (stageData) break;
            } 
            if(stageData) {
                stageData.team.map(rider => {
                    if(rider.undefined) {
                        rider.undefined = false;
                    }
                    return rider;
                });
                
                setActiveTeam(stageData.team);
                setTransfers(stageData.transfers);
                setSavedTeam(stageData.team);
                setSavedTransfers(stageData.transfers);
            } else {
                setActiveTeam([]);
                setTransfers(0);
                setSavedTeam([]);
                setSavedTransfers(0);
            }
        } else {
            stageData.team.map(rider => {
                if(rider.undefined) {
                    rider.undefined = false;
                }
                return rider;
            });
            
            setActiveTeam(stageData.team);
            setTransfers(stageData.transfers);
            setSavedTeam(stageData.team);
            setSavedTransfers(stageData.transfers);
        }
    }, [selectedPlanId, activeStage, plans]);

    return (
        <TeamContext.Provider value={{
            activeTeam, setActiveTeam, addRider,
            removeRider, savedTeam,
            budget, setBudget, transfers,
            setSavedTransfers, setSavedTeam
            }}>
            {children}
        </TeamContext.Provider>
    );
}
