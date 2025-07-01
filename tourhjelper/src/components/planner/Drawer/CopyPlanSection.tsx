import React, { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { Button, Tooltip, NativeSelect } from "@mantine/core";
import classes from "@/styles/Drawer/CopyPlanSection.module.css";
import { usePlanContext } from "@/providers/PlanProvider";
import { Plan } from "@/types/Plan";

interface CopyPlanSectionProps {
  close: () => void;
}

export function CopyPlanSection({ close }: CopyPlanSectionProps) {
  const { selectedPlanId, plans, setPlans } = usePlanContext();
  const [plansToCopy, setPlansToCopy] = useState<Plan[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const otherPlans = plans.filter((plan) => plan.id !== selectedPlanId);
    setPlansToCopy(otherPlans);
  }, [selectedPlanId, plans]);

  const handleCopyPlan = async () => {
    const planToCopy: Plan = plansToCopy[index];

    if (!selectedPlanId || !planToCopy) return;

    const planName = planToCopy.name + " (Kopi)";
    const newPlan: Plan = {
      id: selectedPlanId,
      name: planName,
      stages: planToCopy.stages,
    };
    const newPlans = [
      ...plans.filter((plan) => plan.id != selectedPlanId),
      newPlan,
    ];
    setPlans(newPlans);
    close();
  };

  return (
    <div className={classes.container}>
      <p
        className={
          plansToCopy.length === 0 ? classes.disabledLabel : classes.label
        }>
        Kopier annen plan
      </p>
      <div className={classes.innerContainer}>
        <NativeSelect
          data={plansToCopy.map((plan) => ({
            value: plan.id,
            label: plan.name,
          }))}
          value={plansToCopy[index]?.id}
          onChange={(e) => {
            const selectedPlan = plansToCopy.find(
              (plan) => plan.id === e.currentTarget.value
            );
            if (selectedPlan) {
              setIndex(plansToCopy.indexOf(selectedPlan));
            }
          }}
          classNames={classes}
          className={classes.select}
          disabled={plansToCopy.length === 0}
        />

        <Tooltip
          label={
            plansToCopy.length === 0 ? "Ingen planer å kopiere" : "Kopier plan"
          }
          zIndex={10000}>
          <Button
            size="sm"
            color="white"
            classNames={classes}
            className={classes.switchButton}
            onClick={handleCopyPlan}
            disabled={plansToCopy.length === 0}>
            <IconCopy size={22} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
