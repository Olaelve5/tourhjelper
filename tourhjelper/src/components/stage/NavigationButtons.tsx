import { useEffect } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSelector,
} from "@tabler/icons-react";
import { Button, NativeSelect } from "@mantine/core";
import { useStageContext } from "@/providers/StageProvider";
import classes from "@/styles/Stage/NavigationButtons.module.css";
import { track } from "@vercel/analytics";

interface NavigationButtonsProps {
  isLinked: boolean;
  isSingleView: boolean;
  stage: number;
  setStage: (stage: number) => void;
}

// Generate array [1, 2, ... 21]
const stages = Array.from({ length: 21 }, (_, i) => i + 1);

export function NavigationButtons({
  isLinked,
  isSingleView,
  stage,
  setStage,
}: NavigationButtonsProps) {
  const { activeStage, setActiveStage } = useStageContext();

  // How many stages do we move when clicking next/prev?
  const increment = isSingleView ? 1 : 2;

  // Sync with context if Linked Mode is on
  useEffect(() => {
    if (isLinked) {
      setStage(activeStage);
    }
  }, [activeStage, isLinked, setStage]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStage = parseInt(event.currentTarget.value, 10);

    if (isLinked) {
      setActiveStage(selectedStage);
    }
    setStage(selectedStage);

    track("Stage Changed", {
      method: "select",
      viewType: isSingleView ? "single" : "multiple",
      isLinked: isLinked,
      stage: selectedStage,
    });
  };

  const handleSideClick = (direction: number) => {
    const step = direction * increment;
    const nextStage = stage + step;

    // Safety checks
    if (nextStage < 1 || nextStage > 21) return;

    if (isLinked) {
      setActiveStage(nextStage);
    }
    setStage(nextStage);

    track("Stage Changed", {
      method: "button",
      viewType: isSingleView ? "single" : "multiple",
      isLinked: isLinked,
      stage: nextStage,
    });
  };

  // Logic to hide/show buttons
  const isLeftHidden = stage === 1;
  const isRightHidden = stage + increment > 21;

  // Generate the labels dynamically based on View Mode
  const selectData = stages.map((s) => {
    let label = `Etappe ${s}`;

    // If Desktop view (and not the very last stage), show "Etappe X & Y"
    if (!isSingleView && s < 21) {
      label = `Etappe ${s} & ${s + 1}`;
    }

    return {
      value: s.toString(),
      label: label,
    };
  });

  return (
    <div className={classes.container}>
      {/* LEFT BUTTON */}
      {isLeftHidden ? (
        <div className={classes.ghostButton} />
      ) : (
        <Button
          size="xs"
          className={classes.sidebutton}
          onClick={() => handleSideClick(-1)}>
          <IconChevronLeft size={26} />
        </Button>
      )}

      <NativeSelect
        value={stage}
        onChange={handleSelectChange}
        size="md"
        data={selectData}
        classNames={{ input: classes.select }}
        rightSection={
          <IconSelector
            size={20}
            color="white"
            className={classes.selectorIcon}
          />
        }
        leftSection={<div />}
        leftSectionWidth={14}
        rightSectionWidth={34}
        variant="unstyled"
      />

      {/* RIGHT BUTTON */}
      {isRightHidden ? (
        <div className={classes.ghostButton} />
      ) : (
        <Button
          size="xs"
          className={classes.sidebutton}
          onClick={() => handleSideClick(1)}>
          <IconChevronRight size={26} />
        </Button>
      )}
    </div>
  );
}
