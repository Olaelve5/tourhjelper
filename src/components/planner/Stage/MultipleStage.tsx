import React, {useEffect} from 'react';

import { StageImage } from './StageImage';
import classes from '@/styles/Stage/MultipleStage.module.css';
import { Stage } from '@/types/Stage';

interface MultipleStageProps {
    stageChunkData: Stage[] | null;
}

export function MultipleStage({ stageChunkData }: MultipleStageProps) {
    if (!stageChunkData || stageChunkData.length === 0) {
        return <div>Laster....</div>;
    }

    return (
        <div className={classes.container}>
            {stageChunkData.map((stageData, index) => (
                <div key={index} className={classes.containerMultipleView}>
                    <div>
                        <h4>Etappe {stageData.stage}</h4>
                    </div>
                    <StageImage imageURL={stageData.imageURL} />
                </div>
            ))}
        </div>
    );
}