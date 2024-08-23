import {useEffect, useRef, useState} from 'react';

import { Badge } from '@mantine/core';
import { BudgetTransfers } from './BudgetTransfers';
import {getRiderVisuals } from '@/utils/MapHelpers';
import classes from '@/styles/Map/RiderMap.module.css';
import { useTeamContext } from '@/providers/TeamProvider';
import { UpdateButton } from './UpdateButton';
import { SwitchViewButton } from './SwitchViewButton';
import { useStageContext } from '@/providers/StageProvider';
import { useSwipe } from '@/utils/swipeUtils';

interface RidersMapProps {
    handleMapVisibility: () => void;
}


export function RidersMap({ handleMapVisibility }: RidersMapProps) {
    const { activeTeam } = useTeamContext();
    const { activeStage, setActiveStage } = useStageContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);

    const onSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            if(activeStage >= 21) return;
            setActiveStage(activeStage + 1);
        } else {
            if(activeStage <= 1) return;
            setActiveStage(activeStage - 1);
        }
    }

    useSwipe({ ref: containerRef, onSwipe, touchStartX, touchStartY, setTouchStartX, setTouchStartY });


  return (
    <div className={classes.container} ref={containerRef}>
        <BudgetTransfers />
        <div className={classes.innerContainer}>
            <div className={classes.rowWrapper}>
                <div className={classes.duoWrapper}>
                    {getRiderVisuals(activeTeam, 'Kaptein')}
                    <Badge className={classes.badge} size='xs'>Kaptein</Badge>
                </div>
                <div className={classes.duoWrapper}>
                    {getRiderVisuals(activeTeam, 'Spurter')}
                    <Badge className={classes.badge} size='xs'>Spurter</Badge>
                </div>
            </div>
            <div className={classes.rowWrapper}>
                <div className={classes.duoWrapper}>
                    {getRiderVisuals(activeTeam, 'Klatrer')}
                    <Badge className={classes.badge} size='xs'>Klatrer</Badge>
                </div>
                <div className={classes.duoWrapper}>
                    {getRiderVisuals(activeTeam, 'Ungdomsrytter')}
                    <Badge className={classes.badge} size='xs'>Ungdomsrytter</Badge>
                </div>
            </div>
            <div className={classes.duoWrapper}>
                    {getRiderVisuals(activeTeam, 'Hjelperytter')}
                    <Badge className={classes.badge} size='xs'>Hjelperytter</Badge>
                </div>
            <div className={classes.tempoDirektorContainer}>
                <div className={classes.tempoDirektorWrapper}>
                    {getRiderVisuals(activeTeam, 'Temporytter')}
                    <Badge className={classes.badge} size='xs'>Temporytter</Badge>
                </div>
                <div className={classes.tempoDirektorWrapper}>
                    {getRiderVisuals(activeTeam, 'Sportsdirektør')}
                    <Badge className={classes.badge} size='xs'>Sportsdirektør</Badge>
                </div>
            </div>
        </div>
        <div className={classes.updateContainer}>
            <SwitchViewButton handleMapVisibility={handleMapVisibility}/>
            <UpdateButton />
        </div>
    </div>
  );
}