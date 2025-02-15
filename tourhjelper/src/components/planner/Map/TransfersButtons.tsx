import React from 'react';

import { useDisclosure } from '@mantine/hooks';
import { Tooltip, Button } from '@mantine/core';
import { IconRestore, IconTrashXFilled, IconSettings } from '@tabler/icons-react';
import classes from '@/styles/Map/TransferButtons.module.css';
import { useTeamContext } from '@/providers/TeamProvider';
import { SettingsDrawer } from '../Drawer/SettingsDrawer';

export function EmptyButton() {
  const {setActiveTeam} = useTeamContext();

  return (
    <Tooltip label="Tøm laget">
          <Button onClick={() => setActiveTeam([])} className={classes.transferButton} size='xs' id={classes.emptyButton}>
            <IconTrashXFilled size={20} className={classes.icon}/>
          </Button>
    </Tooltip>
  );
}

export function ResetTransfersButton() {
  const {setActiveTeam, savedTeam, activeTeam} = useTeamContext();

  const handleClick = () => {
    activeTeam.map(rider => rider.undefined = false);
    savedTeam.map(rider => rider.undefined = false);
    setActiveTeam(savedTeam);
  }

  return (
    <Tooltip label="Tilbakestill endringer">
          <Button onClick={handleClick} className={classes.transferButton} size='xs' id={classes.resetButton}>
            <IconRestore size={20} className={classes.icon}/>
          </Button>
    </Tooltip>
  );
}

export function SettingsButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <SettingsDrawer opened={opened} close={close} />
      <Tooltip label="Innstillinger">
        <Button onClick={open} className={classes.transferButton} size='xs'>
          <IconSettings size={20} className={classes.icon}/>
        </Button>
      </Tooltip>
    </>
  );
}