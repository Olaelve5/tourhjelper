import {useState, useEffect} from 'react';

import { IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { Menu } from '@mantine/core';
import { useStageContext } from '@/providers/StageProvider';
import classes from '@/styles/Stage/NavigationButtons.module.css';

interface NavigationButtonsProps {
    isLinked: boolean;
    isSingleView: boolean;
    stage: number;
    setStage: (stage: number) => void;
}

const stages = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
];

const chunkedStages = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18],
    [19, 20, 21]
]

export function NavigationButtons({isLinked, isSingleView, stage, setStage}: NavigationButtonsProps) {
    const {activeStage, setActiveStage} = useStageContext();
    const [opened, setOpened] = useState(false);

    const handleMenuClick = (stage: number) => {
        if(isLinked) {
            setActiveStage(stage);
        }
        setStage(stage);
    };

    const items = () => {
        if(isSingleView) {
            return stages.map((stage, index) => {
                return (
                    <Menu.Item 
                    key={index} 
                    onClick={() => handleMenuClick(stage)} 
                    className={classes.dropDownItem}>
                        Etappe {stage}
                    </Menu.Item>
                )
            });
        } else {
            return chunkedStages.map((chunk, index) => {
                return (
                    <div key={index}>
                        <Menu.Item onClick={() => handleMenuClick(chunk[0])} className={classes.dropDownItem}>
                            Etappe {chunk[0]} - {chunk[2]}
                        </Menu.Item>
                    </div>
                )
            });
        }
    }

    const displayStageName = () => {
        if(isSingleView) {
            return `Etappe ${stage}`;
        } else {
            const chunk = chunkedStages.find(chunk => chunk.includes(stage));
            if(chunk) {
                return `Etappe ${chunk[0]} - ${chunk[2]}`;
            }
            return '';
        }
    }


    const handleSideClick = (direction: number) => {
        if(!isSingleView) {
            const currentIndex = chunkedStages.findIndex(chunk => chunk.includes(stage));
            if(currentIndex + direction >= 0 && currentIndex + direction <= chunkedStages.length - 1) {
                const newChunk = chunkedStages[currentIndex + direction];
                if(isLinked) {
                    setActiveStage(newChunk[0]);
                }
                setStage(newChunk[0]);
            }
            return;
        }

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
            <Menu
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            shadow="md"
            width={200}
            transitionProps={{duration: 200, transition: 'fade'}}
            >
                <Menu.Target>
                    <div className={classes.middleButton}>
                        <h4>{displayStageName()}</h4>
                        <IconChevronDown size={22} stroke={2} className={classes.dropDownIcon}/>
                    </div>
                </Menu.Target>
                <Menu.Dropdown className={classes.dropDown}>
                    {items()}
                </Menu.Dropdown>
            </Menu>

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