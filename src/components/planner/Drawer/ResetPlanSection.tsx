import React, {useState, useEffect} from "react";

import { Button } from '@mantine/core';
import classes from '@/styles/Drawer/ResetPlanSection.module.css';
import { IconRestore, IconRotateClockwise2, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useStageContext } from "@/providers/StageProvider"; 
import { usePlanContext } from "@/providers/PlanProvider";
import { useAuth } from "@/providers/AuthProvider";
import { resetPlanFromStageInDB } from "@/utils/firebase/firebasePlanUtils";

interface ResetPlanSectionProps {
    close: () => void;
}

export function ResetPlanSection({close}: ResetPlanSectionProps) {
    const {user} = useAuth();
    const {selectedPlanId, plans, setPlans} = usePlanContext();
    const {activeStage, setActiveStage} = useStageContext();
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState(activeStage);

    useEffect(() => {
        setStage(activeStage);
    }, [activeStage]);

    const handleUpDownClick = (direction: number) => {
        const newStage = stage + direction;
        if (newStage < 1) {
            setStage(1);
        } else if(newStage > 21) {
            setStage(21);
        } else {
            setStage(newStage);
        }
    }

    const getHighestStageFromPlan = () => {
        const plan = plans.find(plan => plan.id === selectedPlanId);
        if (plan) {
            let highestStage = 1;
            plan.stages.forEach(stage => {
                if (stage.stage > highestStage) {
                    highestStage = stage.stage;
                }
            });
            return highestStage;
        }
        return 1
    }

    const handleResetClick = async () => {
        setLoading(true);
        if (user && selectedPlanId) {
            try {
                await resetPlanFromStageInDB(user.uid, selectedPlanId, stage);
            } catch (error) {
                console.error(error);
            }
        }
        const plan = plans.find(plan => plan.id === selectedPlanId);
        if (plan) {
            const updatedStages = plan.stages.filter(stage => stage.stage <= activeStage);
            const updatedPlan = {...plan, stages: updatedStages};
            const updatedPlans = plans.map(plan => {
                if (plan.id === selectedPlanId) {
                    return updatedPlan;
                }
                return plan;
            });
            setPlans(updatedPlans);
            setActiveStage(stage);
            close();
        } else {
            console.error('Selected plan not found');
            setLoading(false);
        }
        setLoading(false);
    }

    return (
        <div className={classes.container}>
            <p className={classes.labelTop}>Tilbakestill</p>
            <div className={classes.innerContainer}>
                <Button
                onClick={handleResetClick}
                loading={loading}
                disabled={stage >= getHighestStageFromPlan()}
                leftSection={<IconRotateClockwise2 size={20} />}
                className={classes.button}
                justify="left"
                >
                    Fra etappe: {stage}
                </Button>
                <div className={classes.upDownContainer}>
                    <Button onClick={() => handleUpDownClick(1)} className={classes.upDownButton} radius={0}>
                        <IconChevronUp size={16} />
                    </Button>
                    <Button onClick={() => handleUpDownClick(-1)} className={classes.upDownButton} radius={0}>
                        <IconChevronDown size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}