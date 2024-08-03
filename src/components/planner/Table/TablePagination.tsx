import React, {useEffect} from "react";

import { Pagination } from "@mantine/core";
import classes from '@/styles/Table/TablePagination.module.css';
import { useFilterContext } from '@/providers/FilterTableProvider';

interface TablePaginationProps {
    data: Array<any>;
}

export function TablePagination({ data }: TablePaginationProps) {
    const { page, setPage } = useFilterContext();

    const getControlStyles = (active: boolean) => ({
        background: active ? 'var(--blue-selected)' : 'initial',
        color: active ? 'white' : 'initial',
    });

    return (
        <Pagination
            classNames={classes}
            withControls
            total={data.length}
            size="sm"
            siblings={1}
            value={page}
            onChange={setPage}
        />
    );
};