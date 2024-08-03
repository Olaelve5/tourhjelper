import React, {useState, useEffect} from 'react';

import { TextInput, Drawer, Button } from '@mantine/core';
import classes from '@/styles/Drawer/SettingsDrawer.module.css';
import { EditNameInput } from './EditNameInput';
import { CopyPlanSection } from './CopyPlanSection';
import { ResetPlanSection } from './ResetPlanSection';
import { DeletePlanButton } from './DeletePlanButton';
import { usePlanContext } from '@/providers/PlanProvider';

interface SettingsDrawerProps {
    opened: boolean;
    close: () => void;
}

export function SettingsDrawer({ opened, close }: SettingsDrawerProps) {
    const { selectedPlanId, plans } = usePlanContext();
    const [name, setName] = useState('Plan 1');

    useEffect(() => {
        if(selectedPlanId) {
            const plan = plans.find(plan => plan.id === selectedPlanId);
            if(plan) {
                setName(plan.name);
            }
        }
    }, [selectedPlanId, plans]);

    return (
        <>
            <Drawer 
            size='sm' 
            opened={opened} 
            onClose={close} 
            title={'Innstillinger for ' + name} 
            classNames={classes} 
            lockScroll={false}
            >
                <EditNameInput close={close}/>
                <CopyPlanSection close={close}/>
                <ResetPlanSection close={close}/>
                <DeletePlanButton close={close}/>
            </Drawer>
        </>
    );
}