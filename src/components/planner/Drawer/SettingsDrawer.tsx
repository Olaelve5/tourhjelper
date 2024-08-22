import React, {useState, useEffect, useRef} from 'react';

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
    const drawerRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);

    useEffect(() => {
        if(selectedPlanId) {
            const plan = plans.find(plan => plan.id === selectedPlanId);
            if(plan) {
                setName(plan.name);
            }
        }
    }, [selectedPlanId, plans]);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartX(e.touches[0].clientX);
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            if (touchStartX - touchEndX > 40) {
                if(touchStartY - touchEndY > Math.abs(30)) return;
                console.log('closing drawer');
                close();
            }
        };

        const touchableElement = drawerRef.current;
        if (touchableElement) {
            touchableElement.addEventListener('touchstart', handleTouchStart);
            touchableElement.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (touchableElement) {
                touchableElement.removeEventListener('touchstart', handleTouchStart);
                touchableElement.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [touchStartX, touchStartY, opened, close]);

    return (
        <>
            <Drawer 
            size='sm' 
            opened={opened} 
            onClose={close} 
            title={'Innstillinger for ' + name} 
            classNames={classes} 
            ref={drawerRef}
            >
                <EditNameInput close={close}/>
                <CopyPlanSection close={close}/>
                <ResetPlanSection close={close}/>
                <DeletePlanButton close={close}/>
            </Drawer>
        </>
    );
}