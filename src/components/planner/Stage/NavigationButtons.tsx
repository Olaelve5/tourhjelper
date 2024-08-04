import {useState, useEffect} from 'react';

import { IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { Menu } from '@mantine/core';
import { useStageContext } from '@/providers/StageProvider';
import classes from '@/styles/Stage/NavigationButtons.module.css';

interface NavigationButtonsProps {
    isLinked: boolean;
}

export function NavigationButtons({isLinked}: NavigationButtonsProps) {
    const {activeStage, setActiveStage} = useStageContext();
    const [opened, setOpened] = useState(false);
    const [stage, setStage] = useState(1);

    const items = () => {
        let items = [];
        for (let i = 1; i <= 21; i++) {
            items.push(
                <Menu.Item 
                key={i}
                className={classes.dropDownItem}
                onClick={() => (
                    setStage(i),
                    setOpened(false),
                    isLinked ? setActiveStage(i) : null
                )}>
                    Etappe {i}
                </Menu.Item>
            );
        }
        return items;
    };

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
                        <h4 style={{margin: 10}}>Etappe {stage}</h4>
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