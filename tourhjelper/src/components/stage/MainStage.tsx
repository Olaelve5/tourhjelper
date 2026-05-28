import { useState, useEffect, useRef } from "react";
import { Container, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import classes from "@/styles/Stage/MainStage.module.css";
import singleStageClasses from "@/styles/Stage/SingleStage.module.css";
import { NavigationButtons } from "./NavigationButtons";
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
  const theme = useMantineTheme();

  const { width } = useViewportSize();
  const [isLinked, setIsLinked] = useState(false);

  // Local state for navigation (so we can swipe without changing the global context immediately unless linked)
  const [stage, setStage] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

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
    const increment = 1;

    if (direction === "left") {
      if (stage + increment > 21) return;
      setStage((prev) => prev + increment);
    } else {
      if (stage - increment < 1) return;
      setStage((prev) => prev - increment);
    }

    track("Stage Changed", {
      method: "swipe",
      viewType: "single",
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
        <div
          className={classes.headerContainer}
          style={{ backgroundColor: "var(--header-color)" }}>
          <NavigationButtons
            isLinked={isLinked}
            isSingleView={true}
            stage={stage}
            setStage={setStage}
          />
        </div>

        <div style={{ width: "100%" }}>
          <SingleStageSkeleton />
        </div>
      </Container>
    );
  }

  const currentStageData = allStages.find((s) => s.stage_number === stage);
  const nextStageData = allStages.find((s) => s.stage_number === stage + 1);

  return (
    <Container size="lg" className={classes.container} ref={containerRef}>
      <div
        className={classes.headerContainer}
        style={{ backgroundColor: "var(--header-color)" }}>
        {/* <Link setIsLinked={setIsLinked} /> */}
        <NavigationButtons
          isLinked={isLinked}
          isSingleView={true}
          stage={stage}
          setStage={setStage}
        />
      </div>

      <div style={{ width: "100%" }}>
        {currentStageData ? (
          <SingleStage stageData={currentStageData} />
        ) : (
          <SingleStageSkeleton />
        )}
      </div>
    </Container>
  );
}

// --- Skeleton Placeholder Component ---
const SingleStageSkeleton = () => {
  return (
    <div className={singleStageClasses.container} style={{width: "100%"}}>
      <div className={singleStageClasses.imageInfoContainer}>
        {/* Stage Image Skeleton */}
        <div className={singleStageClasses.skeletonImage} />
        {/* Stage Info Skeletons */}
        <div className={singleStageClasses.skeletonInfoContainer}>
          <div className={singleStageClasses.skeletonInfoItem} />
          <div className={singleStageClasses.skeletonInfoItem} />
          <div className={singleStageClasses.skeletonInfoItem} />
          <div className={singleStageClasses.skeletonInfoItem} />
        </div>
      </div>

      {/* Favorites Skeletons */}
      <div className={singleStageClasses.skeletonFavoritesContainer}>
        {/* Star Section 3 */}
        <div className={singleStageClasses.skeletonStarSection}>
          <div className={singleStageClasses.skeletonStarHeader} style={{ width: "25%" }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div className={singleStageClasses.skeletonRiderRow} key={`fav-3-${i}`}>
              <div className={singleStageClasses.skeletonRiderLeft}>
                <div className={singleStageClasses.skeletonRiderImage} />
                <div>
                  <div className={singleStageClasses.skeletonRiderName} />
                  <div className={singleStageClasses.skeletonRiderTeam} />
                </div>
              </div>
              <div className={singleStageClasses.skeletonRiderRight}>
                <div className={singleStageClasses.skeletonRiderPrice} />
                <div className={singleStageClasses.skeletonRiderCat} />
              </div>
            </div>
          ))}
        </div>

        {/* Star Section 2 */}
        <div className={singleStageClasses.skeletonStarSection}>
          <div className={singleStageClasses.skeletonStarHeader} style={{ width: "18%" }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div className={singleStageClasses.skeletonRiderRow} key={`fav-2-${i}`}>
              <div className={singleStageClasses.skeletonRiderLeft}>
                <div className={singleStageClasses.skeletonRiderImage} />
                <div>
                  <div className={singleStageClasses.skeletonRiderName} style={{ width: "90px" }} />
                  <div className={singleStageClasses.skeletonRiderTeam} style={{ width: "60px" }} />
                </div>
              </div>
              <div className={singleStageClasses.skeletonRiderRight}>
                <div className={singleStageClasses.skeletonRiderPrice} />
                <div className={singleStageClasses.skeletonRiderCat} />
              </div>
            </div>
          ))}
        </div>

        {/* Star Section 1 */}
        <div className={singleStageClasses.skeletonStarSection}>
          <div className={singleStageClasses.skeletonStarHeader} style={{ width: "12%" }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div className={singleStageClasses.skeletonRiderRow} key={`fav-1-${i}`}>
              <div className={singleStageClasses.skeletonRiderLeft}>
                <div className={singleStageClasses.skeletonRiderImage} />
                <div>
                  <div className={singleStageClasses.skeletonRiderName} style={{ width: "75px" }} />
                  <div className={singleStageClasses.skeletonRiderTeam} style={{ width: "55px" }} />
                </div>
              </div>
              <div className={singleStageClasses.skeletonRiderRight}>
                <div className={singleStageClasses.skeletonRiderPrice} />
                <div className={singleStageClasses.skeletonRiderCat} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
