import React from "react";

import { MainFilter } from "./MainFilter";
import { MainTable } from "./MainTable";
import classes from '@/styles/Table/Filter.module.css';

interface FilterTableProps {
    handleMapVisibility: () => void;
}

export function FilterTable({handleMapVisibility}: FilterTableProps) {
    return (
        <div className={classes.mainContainer}>
            <MainFilter handleMapVisibility={handleMapVisibility}/>
            <MainTable />
        </div>
    );
}