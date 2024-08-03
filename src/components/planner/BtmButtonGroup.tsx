import React from "react";

import { UpdateButton } from "./UpdateButton";
import classes from "@/styles/Buttons.module.css";

export const BtmButtonGroup = () => {
    return (
        <div className={classes.container}>
            {/* <StageButton /> */}
            <UpdateButton />
            {/* <ResetPlanButton /> */}
        </div>
    );
};