import React, {useState, useEffect} from 'react';

import { Button, TextInput, Tooltip } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import classes from '@/styles/Drawer/EditNameInput.module.css';
import { changePlanNameInDB } from '@/utils/firebase/firebasePlanUtils';
import { usePlanContext } from '@/providers/PlanProvider';
import { useAuth } from '@/providers/AuthProvider';

interface EditNameInputProps {
    close: () => void;
}


export function EditNameInput({ close }: EditNameInputProps){
    const { selectedPlanId, plans, setPlans } = usePlanContext();
    const { user } = useAuth();
    const [name, setName] = useState(plans.find(plan => plan.id === selectedPlanId)?.name || 'Plan 1');
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
        if (!selectedPlan) {
            console.error('Selected plan not found');
            return;
        }

        setLoading(true);
    
        const originalName = selectedPlan.name;
        if (name === '' || name === originalName) {
            close();
            setLoading(false);
            return;
        };
    
        if (user && selectedPlanId) {
            try {
                await changePlanNameInDB(user.uid, selectedPlanId, name);
            } catch (error) {
                console.error(error);
            }
        }
    
        const updatedPlans = plans.map(plan => {
            if (plan.id === selectedPlanId) {
                return { ...plan, name: name };
            }
            return plan;
        });
    
        setPlans(updatedPlans);
        close();
        setLoading(false);
    };

    useEffect(() => {
        if(selectedPlanId) {
            const plan = plans.find(plan => plan.id === selectedPlanId);
            if(plan) {
                setName(plan.name);
            }
        }
    }, [selectedPlanId, plans]);

    return (
        <div className={classes.container}>
            <p className={classes.label}>Kopier annen plan</p>
            <div className={classes.innerContainer}>
                <TextInput
                        placeholder="Skriv inn navn" 
                        value={name} 
                        onChange={(event) => setName(event.currentTarget.value)}
                        classNames={classes}
                />
                <Tooltip label='Lagre navn' zIndex={10000}>
                    <Button className={classes.saveButton} onClick={handleClick} loading={loading}>
                        <IconDeviceFloppy size={20} stroke={2} color='white' className={classes.saveIcon}/>
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}