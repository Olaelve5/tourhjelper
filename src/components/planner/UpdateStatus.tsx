import { IconCircleCheckFilled, IconAlertCircleFilled } from '@tabler/icons-react'
import { Tooltip, Overlay } from '@mantine/core';
import { useState, useEffect } from 'react';
import { usePlanContext } from '@/providers/PlanProvider';
import { useStageContext } from '@/providers/StageProvider';
import classes from '@/styles/UpdateButton.module.css';

export function UpdateStatus() {
    const { activeStage } = useStageContext();
    const { plans, selectedPlanId } = usePlanContext();
    const [status, setStatus] = useState<boolean | null>(null);

    useEffect(() => {
        if (selectedPlanId) {
            const plan = plans.find(plan => plan.id === selectedPlanId);
            if (plan) {
                const stages = plan.stages;
                const higherStages = stages.filter(stage => stage.stage > activeStage);
                setStatus(higherStages.length === 0);
            }
        }
    }, [plans, selectedPlanId, activeStage]);

    const label = <label>
    Det finnes endringer i senere <br /> etapper som vil bli overskrevet
    </label>

    if(status === null || status === true) {
        return <></>
    }

    return (
        <div>
            <Tooltip 
            label={label}
            position='top' 
            withArrow
            color='red'
            >
                <div className={classes.statusContainer}>
                    <div>
                        <IconAlertCircleFilled size={20} color='red'/>
                    </div>
                </div>
            </Tooltip>
        </div>
    )
}