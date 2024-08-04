import React, {useState, useEffect} from "react";

import {IconSwitchHorizontal, IconCopy} from '@tabler/icons-react';
import {Button, Tooltip} from '@mantine/core';
import classes from '@/styles/Drawer/CopyPlanSection.module.css';
import { usePlanContext } from "@/providers/PlanProvider";
import { Plan } from "@/types/Plan";
import { copyPlanInDB } from "@/utils/firebase/firebasePlanUtils";
import { useAuth } from "@/providers/AuthProvider";

interface CopyPlanSectionProps {
    close: () => void;
}

export function CopyPlanSection({close}: CopyPlanSectionProps) {
    const { user } = useAuth();
    const { selectedPlanId, plans, setPlans } = usePlanContext();
    const [plansToCopy, setPlansToCopy] = useState<Plan[]>([]);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        const otherPlans = plans.filter(plan => plan.id !== selectedPlanId);
        setPlansToCopy(otherPlans);
    }, [selectedPlanId, plans]);

    const getNameToCopy = () => {
        if(plansToCopy.length === 0) return '';
        return plansToCopy[index].name;
    }

    const handleCopyPlan = async () => {
        const planToCopy: Plan = plansToCopy[index];

        if(!selectedPlanId || !planToCopy) return;

        if(user) {
            try {
                await copyPlanInDB(user.uid, planToCopy.id, selectedPlanId);
            } catch(e) {
                console.error("Error copying plan: " + e);
            }
        }

        const planName = planToCopy.name + " (Kopi)";
        const newPlan: Plan = {id: selectedPlanId, name: planName, stages: planToCopy.stages};
        const newPlans = [...plans.filter(plan => plan.id != selectedPlanId), newPlan];
        setPlans(newPlans);
        close();
    }

    return (
        <div className={classes.container}>
            <p className={plansToCopy.length === 0 ? classes.disabledLabel : classes.label}>Kopier annen plan</p>
            <div className={classes.innerContainer}>
                <Button 
                size="sm" 
                style={{marginRight: 10}} 
                color="white"
                disabled={plansToCopy.length === 0}
                leftSection={<IconCopy size={20}/>}
                classNames={classes}
                onClick={handleCopyPlan}
                >
                <p style={{fontWeight: '600', fontSize: '20'}}>Kopier: {getNameToCopy()}</p>
                </Button>
                <Tooltip label='Bytt plan' zIndex={10000}>
                    <Button size="sm" 
                    color="white" 
                    classNames={classes} 
                    className={classes.switchButton}
                    onClick={() => setIndex((index + 1) % plansToCopy.length)}
                    disabled={plansToCopy.length === 0}
                    >
                        <IconSwitchHorizontal size={20}/>
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}