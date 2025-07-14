import React, { useState, useEffect } from "react";
import { Button, NativeSelect, Tooltip } from "@mantine/core";
import classes from "@/styles/Drawer/ResetPlanSection.module.css";
import { IconRotateClockwise2 } from "@tabler/icons-react";
import { useStageContext } from "@/providers/StageProvider";
import { usePlanContext } from "@/providers/PlanProvider";

interface ResetPlanSectionProps {
  close: () => void;
}

export function ResetPlanSection({ close }: ResetPlanSectionProps) {
  const { selectedPlanId, plans, setPlans } = usePlanContext();
  const { activeStage, setActiveStage } = useStageContext();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(activeStage);

  useEffect(() => {
    setStage(activeStage);
  }, [activeStage]);

  const getHighestStageFromPlan = () => {
    const plan = plans.find((plan) => plan.id === selectedPlanId);
    if (plan) {
      let highestStage = 1;
      plan.stages.forEach((stage) => {
        if (stage.stage > highestStage) {
          highestStage = stage.stage;
        }
      });
      return highestStage;
    }
    return 1;
  };

  const handleResetClick = async () => {
    setLoading(true);
    const plan = plans.find((plan) => plan.id === selectedPlanId);
    if (plan) {
      const updatedStages = plan.stages.filter(
        (stage) => stage.stage <= activeStage
      );
      const updatedPlan = { ...plan, stages: updatedStages };
      const updatedPlans = plans.map((plan) => {
        if (plan.id === selectedPlanId) {
          return updatedPlan;
        }
        return plan;
      });
      setPlans(updatedPlans);
      setActiveStage(stage);
      close();
    } else {
      console.error("Selected plan not found");
      setLoading(false);
    }
    setLoading(false);
  };

  const isDisabled = loading || stage < 1 || stage > getHighestStageFromPlan();

  return (
    <div className={classes.container}>
      <p className={isDisabled ? classes.disabledLabel : classes.label}>
        Tilbakestill fra etappe
      </p>
      <div className={classes.innerContainer}>
        <NativeSelect
          value={stage.toString()}
          onChange={(event) => setStage(Number(event.currentTarget.value))}
          data={Array.from({ length: 21 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `Etappe ${i + 1}`,
          }))}
          className={classes.select}
          classNames={classes}
        />
        <Tooltip
          label={
            isDisabled ? "Ingen endringer å tilbakestille" : "Tilbakestill"
          }
          zIndex={10000}>
          <Button
            className={classes.resetButton}
            size="sm"
            color="white"
            classNames={classes}
            onClick={handleResetClick}
            loading={loading}
            disabled={isDisabled}>
            <IconRotateClockwise2 size={24} stroke={2} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
