import React from "react";

import { StageInfo } from './StageInfo';
import { StageImage } from './StageImage';
import { ProgressBar } from './ProgressBar';
import { Favorites } from './Favorites';
import classes from '@/styles/Stage/MainStage.module.css';
import { Stage } from '@/types/Stage';

interface SingleStageProps {
    stageData: Stage | null;
}

export function SingleStage({ stageData }: SingleStageProps) {
    return (
            <div className={classes.innerContainer}>
                <StageImage imageURL={stageData ? stageData.imageURL : ''}/>
                <StageInfo stageData={stageData}/>
                <ProgressBar />
                <Favorites />
            </div>
    );
}