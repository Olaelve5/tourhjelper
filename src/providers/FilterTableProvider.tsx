import React, {createContext, useContext, useState, useEffect} from "react";

import classes from '@/styles/Table/Filter.module.css';
import { Rider } from '@/types/Rider';

interface FilterContextType {
    filters: FilterCriteria;
    updateFilters: (newFilters: keyof FilterCriteria, value: FilterCriteria[keyof FilterCriteria]) => void;
    resetFilters: () => void;
    isReset: boolean;
    setPage: (page: number) => void;
    page: number;
    focusedCategory: string;
    setFocusedCategory: (category: string) => void;
}

interface FilterCriteria {
    category?: string;
    team?: string;
    name?: string;
}

export const FilterContext = createContext<FilterContextType | null>(null);

export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    return context; 
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
    const [filters, setFilters] = useState<FilterCriteria>({}); 
    const [isReset, setIsReset] = useState<boolean>(false); 
    const [page, setPage] = useState<number>(1); 
    const [focusedCategory, setFocusedCategory] = useState<string>('');
    

    const updateFilters = (newFilters: any, value: any) => {
        if (isReset) {
            setIsReset(false);
        }
        console.log({...filters, [newFilters]: value });
        setFilters({ ...filters, [newFilters]: value });
    };

    const resetFilters = () => {
        setFilters({}); 
        setIsReset(true);
    };


    return (
        <FilterContext.Provider value={{
            filters, updateFilters,
            resetFilters, isReset,
            setPage, page,
            focusedCategory, setFocusedCategory
            }}>
            <div>
                {children}
            </div>
        </FilterContext.Provider>
    );
}