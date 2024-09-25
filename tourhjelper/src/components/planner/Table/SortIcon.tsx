import React from 'react';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';

interface SortIconProps {
    type: string;
    isSortedDesc: boolean;
    sortType: string;
};

export function SortIcon({type, isSortedDesc, sortType}: SortIconProps) {
    if (type === sortType) {
        return !isSortedDesc ? 
        <IconChevronDown size={13} color='white' style={{marginLeft: '3px', flexShrink: 0}}/> 
        : 
        <IconChevronUp size={13} color='white' style={{marginLeft: '3px', flexShrink: 0}}/>;
    }
    
    return <IconSelector size={16} color='white' style={{marginLeft: '3px', flexShrink: 0}}/>;
};