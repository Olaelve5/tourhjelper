import React, {useState, useEffect, use} from "react";

import { SegmentedControl } from '@mantine/core';
import classes from '@/styles/Table/FilterBar.module.css';
import { useFilterContext } from "@/providers/FilterTableProvider";
import { useTeamContext } from '@/providers/TeamProvider';

const data = ['Alle', 'Dir', 'Kap', 'Tem', 'Ung', 'Kla', 'Spu', 'Hje'];

const dataExpanded: {[key: string]: string } = {
    'Alle': '',
    'Dir': 'Sportsdirektør',
    'Kap': 'Kaptein',
    'Tem': 'Temporytter',
    'Ung': 'Ungdomsrytter',
    'Kla': 'Klatrer',
    'Spu': 'Spurter',
    'Hje': 'Hjelperytter'
};

function findKeyByValue(value: string): string | undefined {
    return Object.keys(dataExpanded).find(key => dataExpanded[key] === value);
}


export const FilterBar = () => {
    const {updateFilters, isReset, setPage, focusedCategory} = useFilterContext();
    const [value, setValue] = useState(focusedCategory);

    useEffect(() => {
        if(isReset) {
            setValue('Alle');
        }
    }, [isReset]);

    useEffect(() => {
        setValue(findKeyByValue(focusedCategory) || 'Alle');
    }, [focusedCategory]);

    useEffect(() => {
        updateFilters('category', dataExpanded[value]);
    }, [value]);

    return (
        <div>
            <SegmentedControl
            radius="sm"
            value={value}
            onChange={(value) => {
                setPage(1),
                setValue(value),
                updateFilters('category', dataExpanded[value])
            }}
            size="xs"
            data={data}
            classNames={classes}
            />
        </div>
    );
};