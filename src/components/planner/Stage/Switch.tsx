import React, {useEffect, useState} from "react";

import { IconBoxMultiple1, IconBoxMultiple3, IconSquareNumber1 } from "@tabler/icons-react"
import classes from "@/styles/Stage/Switch.module.css";

interface SwitchProps {
    setIsSingleView: (isSingleView: boolean) => void;
}

export function Switch({setIsSingleView}: SwitchProps) {
    const [selected, setSelected] = useState('1');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    const handleSwitch = () => {
        if (selected === '1') {
            setIsSingleView(false);
            setSelected('3');
        } else {
            setIsSingleView(true);
            setSelected('1');
        }
    }

    const getThumbStyle = () => {
        const rightStyle = {transform: 'translateY(-50%) translateX(100%)'};
        const leftStyle = {transform: 'translateY(-50%) translateX(0%)'};

        if (selected === '1') {
            return leftStyle;
        } else {
            return rightStyle;
        }
    }

    const getDisplayForIcon = (iconNumber: string) => {
        if (!isClient) return 'none';

        if(window.innerWidth > 600) {
            return 'block';
        }
        if (selected === iconNumber) {
            return 'block';
        } else {
            return 'none';
        }
    };

    return (
        <div className={classes.switchContainer} onClick={handleSwitch}>
            <IconSquareNumber1 
            size={22} 
            display={getDisplayForIcon('1')}
            className={selected === '1' ? classes.selectedIcon : classes.unSelectedIcon} 
            stroke={2}
            />
            <div className={classes.sliderContainer}>
                <div className={classes.sliderTrack}>
                    <div className={classes.sliderThumb} style={getThumbStyle()}/>
                </div>
            </div>
            <IconBoxMultiple3 
            size={22}
            display={getDisplayForIcon('3')}
            className={selected === '3' ? classes.selectedIcon : classes.unSelectedIcon} 
            stroke={2}
            />
        </div>
    );
}