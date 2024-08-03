import {createContext, useEffect, useContext, useState, useCallback} from 'react';
import { Plan } from '@/types/Plan';
import { generateUniqueId } from '@/utils/idUtils';
import { getPlansFromSessionStorage, savePlansToSessionStorage } from '@/utils/sessionStorageUtils';
import { Rider } from '@/types/Rider';
import { useAuth} from '@/providers/AuthProvider';
import { updatePlanInDB } from '@/utils/firebaseUtils';
import { initializePlans } from '@/utils/planUtils';
import { useLoading } from './LoadingProvider';

interface PlanContextType {
    // Define the types for the context
    plans: Plan[];
    setPlans: (plans: Plan[]) => void;
    addPlan: () => void;
    deletePlan: (plan: Plan) => void;
    updatePlan: (team: Rider[], stage: number, transfers: number) => void;
    selectedPlanId: string | null;
    setSelectedPlanId: (planId: string | null) => void;
};

// Create the context
export const PlanContext = createContext<PlanContextType | null>(null);


// Create the hook to access the context
export const usePlanContext = () => {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error('usePlanContext must be used within a PlanProvider');
    }
    return context;
};

// Create the provider
export function PlanProvider({ children }: { children: React.ReactNode }) {
    const { isLoading, setLoading } = useLoading();
    const { user } = useAuth();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);


    const addPlan = useCallback(() => {
        if (plans.length >= 3) {
            return;
        }

        const newPlan = { id: generateUniqueId(), name: `Plan ${plans.length + 1}`, stages: [], userId: user?.uid };
        setPlans(prevPlans => [...prevPlans, newPlan]);
        setSelectedPlanId(newPlan.id);
    }, [plans]);


    const deletePlan = useCallback((planToDelete: Plan) => {
        const updatedPlans = plans.filter(plan => plan.id !== planToDelete.id);
        setPlans(updatedPlans);
    }, []); 


    const updatePlan = useCallback(async (team: Rider[], stage: number, transfers: number) => {
        const updatedPlan = plans.find(plan => plan.id === selectedPlanId);
        if (!updatedPlan) {
            console.error('Could not find plan to update');
            return;
        }

        if(user && selectedPlanId) {
            try {
                await updatePlanInDB(user.uid, selectedPlanId, updatedPlan.name, team, transfers, stage);
            } catch (error) {
                console.error('Error updating plan:', error);
                return;
            }
        }

        const stageToAdd = { stage, team, transfers };
        updatedPlan.stages = updatedPlan.stages.filter(s => s.stage !== stage && s.stage < stage);
        updatedPlan.stages.push(stageToAdd);

        const updatedPlans = plans.map(plan => plan.id === selectedPlanId ? updatedPlan : plan);
        setPlans(updatedPlans);
    }, [selectedPlanId, plans]);
    

    useEffect(() => {
        const fetchInitPlans = async () => {
            setLoading(true);
            try {
                const initValues = await initializePlans(user);
                if (initValues) {
                    setPlans(initValues.plans);
                    setSelectedPlanId(initValues.selectedPlanId);
                } else {
                    console.error('Could not fetch initial plans');
                }
            } catch (error) {
                console.error('Error fetching initial plans', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitPlans();
    }, [user]);

    useEffect(() => {
        try {
            savePlansToSessionStorage(plans, user?.uid);
        } catch (error) {
            console.error('Could not save plans to session storage', error);
        }
    }, [plans]);

    return (
        <PlanContext.Provider value={{
            plans, setPlans,
            addPlan, deletePlan, updatePlan,
            selectedPlanId, setSelectedPlanId
            }}>
            {children}
        </PlanContext.Provider>
    );
}