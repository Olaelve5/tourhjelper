import React from "react";

import { IconRoad, IconClockExclamation, IconCalendar, IconBike } from "@tabler/icons-react";
import classes from "@/styles/Stage/StageInfo.module.css";

export function StageInfo() {
    return (
        <div className={classes.container}>
            <div>
                <IconCalendar size={20} className={classes.icon}/>
                <span>01.07.24</span>
            </div>
            <div>
                <IconClockExclamation size={20} className={classes.icon}/>
                <span>12:30</span>
            </div>
            <div>
                <IconBike size={20} className={classes.icon}/>
                <span>182.2 km</span>
            </div>
            <div>
                <IconRoad size={20} className={classes.icon}/>
                <span>Flat</span>
            </div>
        </div>
    );
}