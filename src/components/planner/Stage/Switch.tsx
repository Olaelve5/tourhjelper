import React, {useState} from "react";

import { IconBoxMultiple1, IconBoxMultiple3, IconSquareNumber1 } from "@tabler/icons-react"
import classes from "@/styles/Stage/Switch.module.css";
import { Button } from "@mantine/core";

export function Switch() {
    const [selected, setSelected] = useState('1');


    const handleSwitch = () => {
        if (selected === '1') {
            setSelected('3');
        } else {
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

    return (
        <div className={classes.switchContainer}>
            <IconSquareNumber1 
            size={22} 
            className={selected === '1' ? classes.selectedIcon : classes.unSelectedIcon} 
            stroke={2}
            />
            <div className={classes.sliderContainer} onClick={handleSwitch}>
                <div className={classes.sliderTrack}>
                    <div className={classes.sliderThumb} style={getThumbStyle()}/>
                </div>
            </div>
            <IconBoxMultiple3 
            size={22} 
            className={selected === '3' ? classes.selectedIcon : classes.unSelectedIcon} 
            stroke={2}
            />
        </div>
    );
}