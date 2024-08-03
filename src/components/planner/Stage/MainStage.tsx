import {useState} from 'react';

import { Container, Image } from '@mantine/core';
import classes from '@/styles/Stage/MainStage.module.css';
import { ProgressBar } from './ProgressBar';
import { Favorites } from './Favorites';
import { Switch } from './Switch';
import { StageInfo } from './StageInfo';
import { StageImage } from './StageImage';
import { NavigationButtons } from './NavigationButtons';
import { Link } from './Link';

export default function MainStage() {
    const [isLinked, setIsLinked] = useState(false);

    return (
        <Container size='lg' className={classes.container}>
            <div className={classes.headerContainer}>
                <Link setIsLinked={setIsLinked}/>
                <NavigationButtons isLinked={isLinked} />
                <Switch />
            </div>
            <div className={classes.innerContainer}>
                <StageImage imageURL='/stage1.jpeg'/>
                <StageInfo />
                <ProgressBar />
                <Favorites />
            </div>
        </Container>
    );
}