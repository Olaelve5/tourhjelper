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
import { getCurrentStage } from "@/utils/stageUtils";
import { useStages } from "@/hooks/useStages";

export default function MainStage() {
  const { setActiveStage } = useStageContext();
  const { width } = useViewportSize();
  const { data: allStages } = useStages();
  
  const [isLinked, setIsLinked] = useState(false);
  const [stage, setStage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  // Determine view mode based on width
  const isWideScreen = width >= 900;

  // Initialize stage to the current active stage (e.g. today's stage)
  useEffect(() => {
    getCurrentStage().then((currentStage) => {
      setStage(currentStage);
    });
  }, []);

  // Sync context when stage changes if linked
  useEffect(() => {
    if (isLinked) {
      setActiveStage(stage);
    }
  }, [stage, isLinked, setActiveStage]);

  const onSwipe = (direction: string) => {
    // If wide screen, we "turn the page" (move by 2). If mobile, move by 1.
    const increment = isWideScreen ? 2 : 1;

    if (direction === "left") {
      // Swipe Left -> Next Stage
      if (stage + increment > 21) return;
      setStage((prev) => prev + increment);
    } else {
      // Swipe Right -> Previous Stage
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

  // Find the data for the current stages
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
          {/* Left Stage */}
          <div style={{ flex: 1 }}>
            {currentStageData && <SingleStage stageData={currentStageData} />}
          </div>
          
          {/* Right Stage (Only render if it exists - e.g. won't show on Stage 21) */}
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