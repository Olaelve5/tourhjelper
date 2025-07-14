import React, { useState } from "react";
import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { usePlanContext } from "@/providers/PlanProvider";
import { generateUniqueId } from "@/utils/idUtils";
import classes from "@/styles/Drawer/SettingsDrawer.module.css";

interface DeletePlanButtonProps {
  close: () => void;
}

export function DeletePlanButton({ close }: DeletePlanButtonProps) {
  const { selectedPlanId, setPlans, plans, setSelectedPlanId } =
    usePlanContext();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!selectedPlanId) return;
    setLoading(true);
    const remainingPlans = plans.filter((plan) => plan.id !== selectedPlanId);
    if (remainingPlans.length > 0) {
      setPlans(remainingPlans);
      setSelectedPlanId(remainingPlans[0].id);
    } else {
      // If no plans remain, create a new plan
      const newPlan = { id: generateUniqueId(), name: "Plan 1", stages: [] };
      setPlans([newPlan]);
      setSelectedPlanId(newPlan.id);
    }
    close();
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      color="red"
      className={classes.deleteButton}
      leftSection={<IconTrash size={22} />}>
      Slett plan
    </Button>
  );
}
