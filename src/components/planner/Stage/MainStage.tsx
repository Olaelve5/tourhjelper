import {useState, useEffect} from 'react';

import { Container } from '@mantine/core';
import classes from '@/styles/Stage/MainStage.module.css';
import { Switch } from './Switch';
import { NavigationButtons } from './NavigationButtons';
import { Link } from './Link';
import { SingleStage } from './SingleStage';
import { MultipleStage } from './MultipleStage';
import { fetchMultipleStageInfo, fetchSingleStageInfo } from '@/utils/stageUtils';
import { Stage } from '@/types/Stage';
import { removeOutdatedStagesFromCache } from '@/utils/stageUtils';

export default function MainStage() {
    const [isLinked, setIsLinked] = useState(false);
    const [isSingleView, setIsSingleView] = useState(true);
    const [stage, setStage] = useState<number>(1);
    const [stageData, setStageData] = useState<Stage | null>(null);
    const [stageChunkData, setStageChunkData] = useState<Stage[] | null>(null);

    useEffect(() => {
        if(isSingleView) {
            fetchSingleStageInfo(stage).then(data => {
                setStageData(data);
            });
        } else {
            fetchMultipleStageInfo(stage).then(data => {
                setStageChunkData(data);
            });
        }
    }, [stage, isSingleView]);

    useEffect(() => {
        removeOutdatedStagesFromCache();
    }, []);

    return (
        <Container size='lg' className={classes.container}>
            <div className={classes.headerContainer}>
                <Link setIsLinked={setIsLinked}/>
                <NavigationButtons
                isLinked={isLinked}
                isSingleView={isSingleView}
                stage={stage}
                setStage={setStage}
                />
                <Switch setIsSingleView={setIsSingleView}/>
            </div>
            {isSingleView ? <SingleStage stageData={stageData}/> : <MultipleStage stageChunkData={stageChunkData}/>}
        </Container>
    );
}