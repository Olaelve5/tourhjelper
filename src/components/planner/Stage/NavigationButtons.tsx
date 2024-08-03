import {useState, useEffect} from 'react';

import { IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { useStageContext } from '@/providers/StageProvider';
import classes from '@/styles/Stage/NavigationButtons.module.css';

interface NavigationButtonsProps {
    isLinked: boolean;
}

export function NavigationButtons({isLinked}: NavigationButtonsProps) {
    const {activeStage, setActiveStage} = useStageContext();
    const [stage, setStage] = useState(1);

    const handleSideClick = (direction: number) => {
        if (stage + direction > 0 && stage + direction < 22) {
            if(isLinked) {
                setActiveStage(stage + direction);
            }
            setStage(stage + direction);
        }
    };

    useEffect(() => {
        if(isLinked) {
            setStage(activeStage);
        }
    }, [activeStage, isLinked]);

    return (
        <div className={classes.container}>
            {stage <= 1 ? <div className={classes.ghostButton}/> : 
                <Button
                size='xs'
                className={classes.sideButtonLeft}
                onClick={() => handleSideClick(-1)}
                display={stage <= 1 ? 'none' : 'block'}
                >
                    <IconChevronLeft size={26}/>
                </Button>
            }
            <Button size='xs' radius={0} className={classes.middleButton}>
                <h4 style={{margin: 10}}>Etappe {stage}</h4>
                <IconChevronDown size={22} stroke={2}/>
            </Button>

            {stage >= 21 ? <div className={classes.ghostButton}/> : 
                <Button size='xs'
                className={classes.sideButtonRight}
                onClick={() => handleSideClick(1)}
                display={stage >= 21 ? 'none' : 'block'}
                >
                    <IconChevronRight size={26}/>
                </Button>
            }
        </div>
    )
};