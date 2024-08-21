import React from "react";

import { MainFilter } from "./MainFilter";
import { MainTable } from "./MainTable";
import classes from '@/styles/Table/Filter.module.css';

export function FilterTable() {
    return (
        <div className={classes.mainContainer}>
            <MainFilter />
            <MainTable />
        </div>
    );
}