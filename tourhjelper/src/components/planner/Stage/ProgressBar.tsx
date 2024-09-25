import {useState} from 'react';
import classes from '@/styles/Stage/ProgressBar.module.css';
import {Stage} from '@/types/Stage';

interface ProgressBarProps {
    value: number;
}


export function ProgressBar({value}: ProgressBarProps) {

    const calculateHeight = () => {
        const maxValue = 2000;
        const height = 100 - (value / maxValue) * 100;
        if (height < 0) return 0;
        if (height > 100) return 100;
        return height;
    };

    return (
        <div className={classes.container}>
            <div className={classes.barContainer}>
                <div className={classes.bar}/>
                <div className={classes.ghostBar} style={{height: (calculateHeight() + '%')}}/>
            </div>
            <h4 className={classes.points} style={{top: (calculateHeight() - 4 + '%')}}>{value} p.</h4>
        </div>
    );
}
