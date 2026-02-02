import React, { useEffect, useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconSearch, IconTransferIn } from "@tabler/icons-react";
import classes from "@/styles/Import/ImportTeamInput.module.css";
import { useMantineTheme } from "@mantine/core";
import { filterTeamURL } from "@/utils/filterTeamURL";
import { usePlanContext } from "@/providers/PlanProvider";
import { useStageContext } from "@/providers/StageProvider";
import { useTeamContext } from "@/providers/TeamProvider";
import {
  saveIdToLocalStorage,
  getIdFromLocalStorage,
} from "@/utils/localStorageUtils";
import { UpdateNotification } from "../planner/Map/UpdateNotification";
import { calculateCurrentStage } from "@/utils/stageUtils";
import { useStages } from "@/hooks/useStages";
import InforButton from "./InfoButton";

const ImportTeamInput = () => {
  const theme = useMantineTheme();
  const { updatePlan } = usePlanContext();
  const { setActiveStage } = useStageContext();
  const { setActiveTeam } = useTeamContext();

  // 2. Access the cached stage data
  const { data: allStages } = useStages();

  const [value, setValue] = useInputState<string>("");
  const [isValidInput, setIsValidInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updatePlanToImported = async (
    importedRiders: any,
    transfers_used: string,
    targetStage: number,
  ) => {
    if (!importedRiders || importedRiders.length < 13) {
      console.error("Imported team is invalid or incomplete");
      setActiveStage(targetStage);
      setActiveTeam(importedRiders);
      setIsValidInput(false);
      return;
    }

    for (let i = targetStage; i > 0; i--) {
      updatePlan(importedRiders, i, parseInt(transfers_used, 10));
    }

    setActiveStage(targetStage);
    setIsValidInput(true);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
    setIsLoading(false);
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/team-import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: value }),
      });
      const data = await res.json();

      if (res.ok) {
        saveIdToLocalStorage(value);
        const parsedTeam = JSON.parse(data.team);
        const { team: riders, transfers_used } = parsedTeam;

        // 6. Calculate the ACTUAL current stage right now
        // If data isn't loaded yet for some reason, default to 1
        const realCurrentStage = allStages
          ? calculateCurrentStage(allStages)
          : 1;

        console.log("Importing team for stage:", realCurrentStage);

        updatePlanToImported(riders, transfers_used, realCurrentStage);
      } else {
        console.error("Failed to import team");
        setIsValidInput(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsValidInput(false);
    }
  };

  useEffect(() => {
    if (value) {
      const filteredValue = filterTeamURL(value);
      if (filteredValue) {
        setValue(filteredValue);
        setIsValidInput(true);
      } else {
        setIsValidInput(false);
      }
    } else {
      setIsValidInput(true);
    }
  }, [value]);

  useEffect(() => {
    const id = getIdFromLocalStorage();
    if (id) {
      setValue(id);
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <h2>Importer lag</h2>
        <InforButton />
      </div>
      <TextInput
        radius="md"
        size="md"
        value={value}
        classNames={{ input: classes.input }}
        placeholder="Tourmanager link eller ID"
        error={isValidInput ? null : "Noe gikk galt"}
        rightSectionWidth={42}
        leftSection={<IconSearch size={22} stroke={1.5} />}
        onChange={(v) => {
          (setValue(v), setIsValidInput(true));
        }}
      />
      <Button
        size="sm"
        radius="md"
        onClick={handleClick}
        loading={isLoading}
        rightSection={<IconTransferIn size={22} stroke={2} />}
        className={classes.importButton}
        loaderProps={{ type: "dots", color: theme.colors.gray[8] }}
        classNames={{
          loader: classes.loader,
        }}>
        Importer
      </Button>
      <UpdateNotification showUpdateNotification={success} success={true} />
    </div>
  );
};

export default ImportTeamInput;
