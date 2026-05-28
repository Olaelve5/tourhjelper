import React from "react";
import { StageImage } from "./StageImage";
import { Favorites } from "./Favorites";
import classes from "@/styles/Stage/SingleStage.module.css";
import { Stage } from "@/types/Stage";
import { StageInfo } from "./StageInfo";

interface SingleStageProps {
  stageData: Stage | null | undefined; 
}

export function SingleStage({ stageData }: SingleStageProps) {
  if (!stageData) return null; // Or return a Skeleton/Loader

  return (
    <div className={classes.container}>
      <div className={classes.imageInfoContainer}>
        <StageImage imageURL={stageData.image_url ?? ""} />
        <StageInfo stageData={stageData} /> 
      </div>
      <Favorites stageData={stageData} />
    </div>
  );
}