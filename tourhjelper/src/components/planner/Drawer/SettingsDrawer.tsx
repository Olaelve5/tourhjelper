import React, { useState, useEffect, useRef } from "react";

import { Drawer, Modal } from "@mantine/core";
import classes from "@/styles/Drawer/SettingsDrawer.module.css";
import { EditNameInput } from "./EditNameInput";
import { CopyPlanSection } from "./CopyPlanSection";
import { ResetPlanSection } from "./ResetPlanSection";
import { DeletePlanButton } from "./DeletePlanButton";
import { usePlanContext } from "@/providers/PlanProvider";
import { useSwipe } from "@/utils/swipeUtils";

interface SettingsDrawerProps {
  opened: boolean;
  close: () => void;
}

export function SettingsDrawer({ opened, close }: SettingsDrawerProps) {
  const { selectedPlanId, plans } = usePlanContext();
  const [name, setName] = useState("Plan 1");
  const drawerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  const onSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      close();
    }
  };

  useEffect(() => {
    if (selectedPlanId) {
      const plan = plans.find((plan) => plan.id === selectedPlanId);
      if (plan) {
        setName(plan.name);
      }
    }
  }, [selectedPlanId, plans]);

  useSwipe({
    ref: drawerRef,
    onSwipe,
    touchStartX,
    touchStartY,
    setTouchStartX,
    setTouchStartY,
  });

  useEffect(() => {
    if (opened) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [opened]);

  return (
    <>
      <Modal
        size="sm"
        opened={opened}
        lockScroll={false}
        onClose={close}
        title={"Innstillinger for " + name}
        classNames={classes}
        ref={drawerRef}>
        <EditNameInput close={close} />
        <CopyPlanSection close={close} />
        <ResetPlanSection close={close} />
        <DeletePlanButton close={close} />
      </Modal>
    </>
  );
}
