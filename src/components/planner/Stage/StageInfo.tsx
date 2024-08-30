import React, {useState} from "react";

import { IconRoad, IconClockExclamation, IconCalendar, IconBike } from "@tabler/icons-react";
import classes from "@/styles/Stage/StageInfo.module.css";
import { Stage } from "@/types/Stage";

interface StageInfoProps {
    stageData: Stage | null;
}

const getType = (type: string | undefined) => {
    switch(type) {
        case 'Flat':
            return 'Flat';
        case 'Hilly':
            return 'Kupert';
        case 'Mountain':
            return 'Fjell';
        case 'Individual time-trial':
            return 'Individuell tempo';
        case 'Team time-trial':
            return 'Lagtempo';
        default:
            return type;
    }
};

export function StageInfo({ stageData }: StageInfoProps) {


    return (
        <div className={classes.container}>
            <div>
                <IconCalendar size={20} className={classes.icon}/>
                <span>{stageData?.date}</span>
            </div>
            <div>
                <IconClockExclamation size={20} className={classes.icon}/>
                <span>{stageData?.start}</span>
            </div>
            <div>
                <IconBike size={20} className={classes.icon}/>
                <span>{stageData?.distance}</span>
            </div>
            <div id={classes.roadIconContainer}>
                <IconRoad size={20} className={classes.icon}/>
                <span>{getType(stageData?.type)}</span>
            </div>
        </div>
    );
}