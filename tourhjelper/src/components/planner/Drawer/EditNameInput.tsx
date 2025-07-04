import React, { useState, useEffect } from "react";
import { Button, TextInput, Tooltip } from "@mantine/core";
import { IconPencilPlus } from "@tabler/icons-react";
import classes from "@/styles/Drawer/EditNameInput.module.css";
import { usePlanContext } from "@/providers/PlanProvider";

interface EditNameInputProps {
  close: () => void;
}

export function EditNameInput({ close }: EditNameInputProps) {
  const { selectedPlanId, plans, setPlans } = usePlanContext();
  const [name, setName] = useState(
    plans.find((plan) => plan.id === selectedPlanId)?.name || "Plan 1"
  );
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
    if (!selectedPlan) {
      console.error("Selected plan not found");
      return;
    }

    setLoading(true);

    const originalName = selectedPlan.name;
    if (name === "" || name === originalName) {
      close();
      setLoading(false);
      return;
    }

    const updatedPlans = plans.map((plan) => {
      if (plan.id === selectedPlanId) {
        return { ...plan, name: name };
      }
      return plan;
    });

    setPlans(updatedPlans);
    close();
    setLoading(false);
  };

  useEffect(() => {
    if (selectedPlanId) {
      const plan = plans.find((plan) => plan.id === selectedPlanId);
      if (plan) {
        setName(plan.name);
      }
    }
  }, [selectedPlanId, plans]);

  const isDisabled =
    loading ||
    name === "" ||
    name.length < 3 ||
    name.length > 25 ||
    name === plans.find((plan) => plan.id === selectedPlanId)?.name;

  return (
    <div className={classes.container}>
      <p className={classes.label}>Endre navn på plan</p>
      <div className={classes.innerContainer}>
        <TextInput
          placeholder="Skriv inn navn"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          classNames={classes}
        />
        <Tooltip
          label={isDisabled ? "Ikke gyldig navn" : "Lagre navn"}
          zIndex={10000}>
          <Button
            className={classes.saveButton}
            onClick={handleClick}
            leftSection={<IconPencilPlus size={24} stroke={2} />}
            variant="filled"
            disabled={isDisabled}
            loading={loading}></Button>
        </Tooltip>
      </div>
    </div>
  );
}
