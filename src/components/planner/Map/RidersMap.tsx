import React from 'react';

import { Badge } from '@mantine/core';
import { BudgetTransfers } from './BudgetTransfers';
import {getRiderVisuals } from '@/utils/MapHelpers';
import classes from '@/styles/Map/RiderMap.module.css';
import { useTeamContext } from '@/providers/TeamProvider';
import { UpdateButton } from '../UpdateButton';


export function RidersMap() {
    const { activeTeam } = useTeamContext();

  return (
    <div className={classes.container}>
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