import React, {useState} from 'react';

import { IconChevronRight, IconChevronLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { Button, Menu, Tooltip } from '@mantine/core';
import classes from '@/styles/Buttons.module.css';
import { useStageContext } from '@/providers/StageProvider';
import { useTeamContext } from '@/providers/TeamProvider';

export function StageButton() {
    const { activeStage, setActiveStage } = useStageContext();
    const { savedTeam } = useTeamContext();

    const handleSideClick = (direction: number) => {
        if (direction === 1) {
            if (activeStage >= 21 || savedTeam.length === 0) return;
            setActiveStage(activeStage + 1);
            return;
        }
        if (activeStage <= 1) return;
        setActiveStage(activeStage - 1);
    };

    const getRightButton = () => {
        const isDisabled = savedTeam.length === 0;
        const showTooltip = isDisabled && activeStage < 21;
    
        if (activeStage >= 21) {
            return null;
        }
    
        const button = (
            <Button 
                className={classes.sideButtonRight}
                data-disabled={isDisabled}
                onClick={() => handleSideClick(1)}
            >
                <IconChevronRight size={25} stroke={2}/>
            </Button>
        );
    
        return showTooltip ? (
            <Tooltip
                label="Lagre første lag før du går videre!"
                style={{padding: 10}}
            >
                {button}
            </Tooltip>
        ) : button;
    };

    return (
        <div className={classes.stageButtonContainer}>
            {activeStage > 1 ? 
            <Button 
            className={classes.sideButtonLeft} 
            onClick={() => handleSideClick(-1)}
            >
                <IconChevronLeft size={25} stroke={2}/>
            </Button> : null}

            <h4 style={{fontSize: 20}}>Etappe {activeStage}</h4>
            {getRightButton()}
        </div>
    )
}