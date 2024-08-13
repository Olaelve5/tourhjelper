import React from "react";

import { MainFilter } from "./MainFilter";
import { MainTable } from "./MainTable";

export function FilterTable() {
    return (
        <div style={{background: 'var(--dark-grey)', borderRadius: '5px', overflow: 'hidden', height: '100%', boxShadow: '0 10px 8px -8px #0000008b'}}>
            <MainFilter />
            <MainTable />
        </div>
    );
}