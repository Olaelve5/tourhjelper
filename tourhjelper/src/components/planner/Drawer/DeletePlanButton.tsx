import React, {useState} from "react";

import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { deletePlanFromDB } from "@/utils/firebase/firebasePlanUtils";
import { useAuth } from "@/providers/AuthProvider";
import { usePlanContext } from "@/providers/PlanProvider";
import { generateUniqueId } from "@/utils/idUtils";

interface DeletePlanButtonProps {
    close: () => void;
}


export function DeletePlanButton({ close }: DeletePlanButtonProps) {
    const { user } = useAuth();
    const { selectedPlanId, setPlans, plans, setSelectedPlanId } = usePlanContext();
    const [loading, setLoading] = useState(false);


    const handleClick = async () => {
        if(!user || !selectedPlanId) return;
        setLoading(true);
        try {
            await deletePlanFromDB(user.uid, selectedPlanId);
        } catch (error) {
            console.error(error);
        }
        const remainingPlans = plans.filter(plan => plan.id !== selectedPlanId);
        if(remainingPlans.length > 0) {
            setPlans(remainingPlans);
            setSelectedPlanId(remainingPlans[0].id);
        } else {
            const newPlan = { id: generateUniqueId(), name: 'Plan 1', stages: [] };
            setPlans([newPlan]);
            setSelectedPlanId(newPlan.id);
        }
        close();
        setLoading(false);
    };

    return (
        <Button
        onClick={handleClick}
        loading={loading}
        color="red"
        leftSection={<IconTrash size={22}/>}
        style={{position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)'}}
        >
            Slett plan
        </Button>
    );
}