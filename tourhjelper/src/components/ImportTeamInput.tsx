import React, { useEffect, useState } from "react";
import { useTeamContext } from "@/providers/TeamProvider";
import { TextInput, ActionIcon, Loader } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconSearch, IconBike } from "@tabler/icons-react";
import classes from "@/styles/ImportTeamInput.module.css";
import { useRiderContext } from "@/providers/RiderProvider";
import { useMantineTheme } from "@mantine/core";
import { filterTeamURL } from "@/utils/filterTeamURL";
import { usePlanContext } from "@/providers/PlanProvider";
import { useStageContext } from "@/providers/StageProvider";
import {
  saveIdToLocalStorage,
  getIdFromLocalStorage,
} from "@/utils/localStorageUtils";

const ImportTeamInput = () => {
  const theme = useMantineTheme();
  const { setActiveTeam, setSavedTransfers, setSavedTeam } = useTeamContext();
  const { updatePlan } = usePlanContext();
  const { setActiveStage } = useStageContext();
  const [value, setValue] = useInputState<string>("");
  const [isValidInput, setIsValidInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const updatePlanToImported = (
    importedRiders: any,
    transfers_used: string,
    stage: number
  ) => {
    if (!importedRiders || importedRiders.length < 12) {
      console.error("Imported team is invalid or incomplete");
      setIsValidInput(false);
      return;
    }

    for (let i = stage; i > 0; i--) {
      updatePlan(importedRiders, i, parseInt(transfers_used, 10));
    }
    setActiveTeam(importedRiders);
    setSavedTeam(importedRiders);
    setActiveStage(stage);
    setIsValidInput(true);
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
        const { team: riders, transfers_used, current_stage } = parsedTeam;

        updatePlanToImported(riders, transfers_used, current_stage);
        setIsLoading(false);
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
      <h1>Importer lag</h1>
      <TextInput
        radius="md"
        size="md"
        value={value}
        classNames={{ input: classes.input }}
        placeholder="Skriv inn ID"
        error={isValidInput ? null : "Noe gikk galt"}
        rightSectionWidth={42}
        leftSection={<IconSearch size={22} stroke={1.5} />}
        rightSection={
          <ActionIcon
            size={32}
            radius="md"
            variant="filled"
            color={theme.colors.yellow[6]}
            onClick={handleClick}
            className={classes.bikeIcon}>
            {isLoading ? (
              <Loader size="sm" type="dots" color={theme.colors.blue[0]} />
            ) : (
              <IconBike size={22} stroke={1.5} color={theme.colors.blue[0]} />
            )}
          </ActionIcon>
        }
        onChange={(v) => {
          setValue(v), setIsValidInput(true);
        }}
      />
    </div>
  );
};

export default ImportTeamInput;
