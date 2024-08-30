import React from "react";

import { StageInfo } from './StageInfo';
import { StageImage } from './StageImage';
import { ProgressBar } from './ProgressBar';
import { Favorites } from './Favorites';
import classes from '@/styles/Stage/SingleStage.module.css';
import { Stage } from '@/types/Stage';

interface SingleStageProps {
    stageData: Stage | null;
}

export function SingleStage({ stageData }: SingleStageProps) {
    return (
            <div className={classes.container}>
                <div className={classes.imageInfoContainer}>
                    <StageImage imageURL={stageData ? stageData.imageURL : ''}/>
                    <StageInfo stageData={stageData}/>
                </div>
                {/* <ProgressBar value={stageData?.maxPoints ? stageData.maxPoints : 500}/> */}
                <Favorites />
            </div>
    );
}