import React, {useState, useEffect, use} from 'react';
import { Button } from '@mantine/core';
import { IconEdit, IconArrowRight } from '@tabler/icons-react';
import { calculateTransferDifference } from "@/utils/MapHelpers";
import { useTeamContext } from "@/providers/TeamProvider";
import classes from '@/styles/Map/UpdateButton.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { usePlanContext } from '@/providers/PlanProvider';
import { useStageContext } from '@/providers/StageProvider';
import { StorageNotification } from '../StorageNotification';
import { getStorageNotification } from '@/utils/localStorageUtils';
import { UpdateStatus } from './UpdateStatus';
import { UpdateNotification} from './UpdateNotification';

export function UpdateButton() {
  const {activeStage} = useStageContext();
  const { updatePlan, selectedPlanId } = usePlanContext();
  const { user } = useAuth();
  const {activeTeam, savedTeam, budget, transfers, setSavedTeam, setSavedTransfers} = useTeamContext();
  const [changes, setChanges] = useState<number>(0);
  const [updatePossible, setUpdatePossible] = useState<boolean>(false);
  const [hideStorageNotification, setHideStorageNotification] = useState<boolean>(true);
  const [showUpdateNotification, setShowUpdateNotification] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
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
        setUpdateSuccess(true);
      }
    } catch (error) {
      setUpdateSuccess(false);
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
    setShowUpdateNotification(true);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowUpdateNotification(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [showUpdateNotification]);

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
      <div className={classes.notificationContainer}>
          {!hideStorageNotification && <StorageNotification setHideStorageNotification={setHideStorageNotification}/>}
          <UpdateNotification showUpdateNotification={showUpdateNotification} success={updateSuccess} />
      </div>
    </div>
  );
}