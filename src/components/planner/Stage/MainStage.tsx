import {useState, useEffect, useRef} from 'react';

import { Container } from '@mantine/core';
import classes from '@/styles/Stage/MainStage.module.css';
import { Switch } from './Switch';
import { NavigationButtons } from './NavigationButtons';
import { Link } from './Link';
import { SingleStage } from './SingleStage';
import { MultipleStage } from './MultipleStage';
import { fetchStageInfo, fetchStageChunk } from '@/utils/stageUtils';
import { Stage } from '@/types/Stage';
import { removeOutdatedStagesFromCache } from '@/utils/stageUtils';
import { useSwipe} from '@/utils/swipeUtils';
import { useStageContext } from '@/providers/StageProvider';

export default function MainStage() {
    const {activeStage, setActiveStage} = useStageContext();
    const [isLinked, setIsLinked] = useState(false);
    const [isSingleView, setIsSingleView] = useState(true);
    const [stage, setStage] = useState<number>(1);
    const [stageData, setStageData] = useState<Stage | null>(null);
    const [stageChunkData, setStageChunkData] = useState<Stage[] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);

    useEffect(() => {
        if(isSingleView) {
            fetchStageInfo(stage).then(data => {
                setStageData(data);
            });
        } else {
            fetchStageChunk(stage).then(data => {
                setStageChunkData(data);
            });
        }
    }, [stage, isSingleView]);

    useEffect(() => {
        removeOutdatedStagesFromCache();
    }, []);

    const onSwipe = (direction: string) => {
        if (direction === 'left') {
            if(!isSingleView) {
                if(stage + 3 > 21) return;
                setStage(stage + 3);
                if(isLinked) {
                    setActiveStage(stage + 3);
                }
            } else {
                if(stage + 1 > 21) return;
                setStage(stage + 1);
                if(isLinked) {
                    setActiveStage(stage + 1);
                }
            }
        } else {
            if(!isSingleView) {
                if(stage - 3 < 1) return;
                setStage(stage - 3);
                if(isLinked) {
                    setActiveStage(stage - 3);
                }
            } else {
                if(stage - 1 < 1) return
                setStage(stage - 1);
                if(isLinked) {
                    setActiveStage(stage - 1);
                }
            }
        }
    };

    useSwipe({ ref: containerRef, onSwipe, touchStartX, touchStartY, setTouchStartX, setTouchStartY });

    return (
        <Container size='lg' className={classes.container} ref={containerRef}>
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