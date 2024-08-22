import {useEffect, useRef, useState} from 'react';

import { Badge } from '@mantine/core';
import { BudgetTransfers } from './BudgetTransfers';
import {getRiderVisuals } from '@/utils/MapHelpers';
import classes from '@/styles/Map/RiderMap.module.css';
import { useTeamContext } from '@/providers/TeamProvider';
import { UpdateButton } from '../UpdateButton';
import { useStageContext } from '@/providers/StageProvider';


export function RidersMap() {
    const { activeTeam } = useTeamContext();
    const { activeStage, setActiveStage } = useStageContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartX(e.touches[0].clientX);
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            if (touchStartX - touchEndX > 50) {
                if(touchStartY - touchEndY > Math.abs(30)) return;
                if(activeStage >= 21) return;
                setActiveStage(activeStage + 1);
            } else if (touchStartX - touchEndX < -50) {
                if(touchStartY - touchEndY > Math.abs(30)) return;
                if(activeStage <= 1) return;
                setActiveStage(activeStage - 1);
            }
        };

        const touchableElement = containerRef.current;
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
    }, [touchStartX, touchStartY]);


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
            <UpdateButton />
        </div>
    </div>
  );
}