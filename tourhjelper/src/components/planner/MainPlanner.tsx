import React, { useState, useEffect } from "react";
import { Container } from "@mantine/core";
import { RidersMap } from "./Map/RidersMap";
import { PlanIndicator } from "./PlanIndicator";
import { FilterTable } from "./Table/FilterTable";
import classes from "@/styles/MainPlanner.module.css";

const MainPlanner = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);

  const handleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 801) {
        setIsSmallDevice(true);
      } else {
        setIsSmallDevice(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container size="lg" className={classes.container}>
      <div className={classes.loadingPlanContainer}>
        <PlanIndicator />
        <div className={classes.mapTableContainer}>
          {!isSmallDevice && (
            <RidersMap handleMapVisibility={handleMapVisibility} />
          )}
          {!isSmallDevice && (
            <FilterTable handleMapVisibility={handleMapVisibility} />
          )}
          {isSmallDevice && (
            <>
              <div className={isMapVisible ? classes.visible : classes.hidden}>
                <RidersMap handleMapVisibility={handleMapVisibility} />
              </div>
              <div className={!isMapVisible ? classes.visible : classes.hidden}>
                <FilterTable handleMapVisibility={handleMapVisibility} />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MainPlanner;
