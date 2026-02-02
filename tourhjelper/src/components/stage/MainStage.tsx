import { useState, useEffect, useRef } from "react";
import { Container, Loader } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import classes from "@/styles/Stage/MainStage.module.css";
import { NavigationButtons } from "./NavigationButtons";
import { Link } from "./Link";
import { SingleStage } from "./SingleStage";
import { useSwipe } from "@/hooks/useSwipe";
import { useStageContext } from "@/providers/StageProvider";
import { track } from "@vercel/analytics";
import { useStages } from "@/hooks/useStages";

export default function MainStage() {
  // The active stage is managed globally via Context
  // - it's automatically set on todays stage on app load
  const { activeStage, setActiveStage } = useStageContext();
  const { data: allStages } = useStages();

  const { width } = useViewportSize();
  const [isLinked, setIsLinked] = useState(false);

  // Local state for navigation (so we can swipe without changing the global context immediately unless linked)
  const [stage, setStage] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  const isWideScreen = width >= 900;

  // 3. Sync local state with Global Context on mount
  // When the Provider finishes calculating "Today is Stage 5", we update our local view.
  useEffect(() => {
    setStage(activeStage);
  }, [activeStage]);

  // Sync context when stage changes IF linked
  useEffect(() => {
    if (isLinked) {
      setActiveStage(stage);
    }
  }, [stage, isLinked, setActiveStage]);

  const onSwipe = (direction: string) => {
    const increment = isWideScreen ? 2 : 1;

    if (direction === "left") {
      if (stage + increment > 21) return;
      setStage((prev) => prev + increment);
    } else {
      if (stage - increment < 1) return;
      setStage((prev) => prev - increment);
    }

    track("Stage Changed", {
      method: "swipe",
      viewType: isWideScreen ? "multiple" : "single",
      isLinked: isLinked,
      stage: stage,
    });
  };

  useSwipe({
    ref: containerRef,
    onSwipe,
    touchStartX,
    touchStartY,
    setTouchStartX,
    setTouchStartY,
  });

  if (!allStages) {
    return (
      <Container size="lg" className={classes.container}>
        <Loader />
      </Container>
    );
  }

  const currentStageData = allStages.find((s) => s.stage_number === stage);
  const nextStageData = allStages.find((s) => s.stage_number === stage + 1);

  return (
    <Container size="lg" className={classes.container} ref={containerRef}>
      <div className={classes.headerContainer}>
        <Link setIsLinked={setIsLinked} />
        <NavigationButtons
          isLinked={isLinked}
          isSingleView={!isWideScreen}
          stage={stage}
          setStage={setStage}
        />
      </div>

      {isWideScreen ? (
        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            {currentStageData && <SingleStage stageData={currentStageData} />}
          </div>
          <div style={{ flex: 1 }}>
            {nextStageData && <SingleStage stageData={nextStageData} />}
          </div>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          {currentStageData && <SingleStage stageData={currentStageData} />}
        </div>
      )}
    </Container>
  );
}
