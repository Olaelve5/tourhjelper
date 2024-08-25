import React, {useState, useEffect} from 'react';
import { Button } from '@mantine/core';
import { IconEdit, IconArrowRight } from '@tabler/icons-react';
import { calculateTransferDifference } from "@/utils/MapHelpers";
import { useTeamContext } from "@/providers/TeamProvider";
import classes from '@/styles/UpdateButton.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { usePlanContext } from '@/providers/PlanProvider';
import { useStageContext } from '@/providers/StageProvider';
import { StorageNotification } from '../StorageNotification';
import { getStorageNotification } from '@/utils/localStorageUtils';
import { UpdateStatus } from './UpdateStatus';

export function UpdateButton() {
  const {activeStage} = useStageContext();
  const { updatePlan, selectedPlanId } = usePlanContext();
  const { user } = useAuth();
  const {activeTeam, savedTeam, budget, transfers, setSavedTeam, setSavedTransfers} = useTeamContext();
  const [changes, setChanges] = useState<number>(0);
  const [updatePossible, setUpdatePossible] = useState<boolean>(false);
  const [hideStorageNotification, setHideStorageNotification] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const leftSection = () => {
    return (
      <div className={classes.leftSection}>
        {changes}
      </div>
    );
  };

  const handleClick = async () => {
    if(!updatePossible) return;
    setIsLoading(true);

    try {
      if (selectedPlanId) {
        updatePlan(activeTeam, activeStage, transfers);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }

    setSavedTeam(activeTeam);
    setSavedTransfers(transfers);
    const hideStorageNotification = getStorageNotification();

    if (!user && !hideStorageNotification) {
      setHideStorageNotification(false);
    } else {
      setHideStorageNotification(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setChanges(calculateTransferDifference(savedTeam, activeTeam));
    if (
      activeTeam.length < 13 ||
      budget < 0 || 
      transfers > 25 ||
      activeTeam.map(rider => rider.undefined).includes(true) ||
      calculateTransferDifference(savedTeam, activeTeam) === 0 && savedTeam.length != 0) {
      setUpdatePossible(false);
      return;
    }
    setUpdatePossible(true);
  }, [activeTeam, savedTeam, budget, transfers]);

  return (
    <div className={classes.container}>
      <Button
        justify='space-between'
        rightSection={<IconArrowRight size={24} className={classes.rightSection}/>}
        className={updatePossible ? classes.updateButton : classes.updateButtonDisabled}
        onClick={handleClick}
        leftSection={leftSection()}
        disabled={!updatePossible}
        loading={isLoading}
        >
          <h3 className={classes.buttonTitle}>
            Oppdater plan
            {updatePossible && <UpdateStatus />}
          </h3>
      </Button>
      <div>
          {!hideStorageNotification && <StorageNotification setHideStorageNotification={setHideStorageNotification}/>}
      </div>
    </div>
  );
}