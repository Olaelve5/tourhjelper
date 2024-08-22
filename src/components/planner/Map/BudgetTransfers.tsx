import React, {useState, useEffect} from 'react';

import { useTeamContext } from "@/providers/TeamProvider";
import { IconCoins, IconTransfer } from '@tabler/icons-react';
import { StageButton } from '../StageButton';
import classes from '@/styles/Map/BudgetTransfers.module.css';
import { EmptyButton, ResetTransfersButton, SettingsButton } from './TransfersButtons';
import { Group } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';

export function BudgetTransfers() {
  const theme = useMantineTheme();
  const {budget, transfers} = useTeamContext();
  
  return (
    <div className={classes.outerContainer}>
      <StageButton />
      <Group className={classes.container} style={{background: theme.colors.blue[1]}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <IconCoins size={20} className={classes.icon}/>
            <h3 className={budget >= 0 ? "" : classes.negative}>{`${budget}m`}&nbsp;</h3>
            <h3 style={{color: 'var(--icon-grey)'}}>/ 100m</h3>
          </div>
          <div className={classes.budgetContainer}>
            <IconTransfer size={20} className={classes.icon} />
            <h3 className={transfers > 25 ? classes.tooManyTransfers : ''}>{`${transfers}`}&nbsp;</h3>
            <h3 style={{color: 'var(--icon-grey)'}}>/ 25</h3>
          </div>
          <div className={classes.buttonsContainer}>
            <EmptyButton />
            <ResetTransfersButton />
            <SettingsButton />
          </div>
        </Group>
      </div>
  );
}