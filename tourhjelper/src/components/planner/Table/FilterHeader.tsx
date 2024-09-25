import { IconArrowLeft } from '@tabler/icons-react';
import React from 'react';
import classes from '@/styles/Table/FilterHeader.module.css';
import { useTeamContext } from '@/providers/TeamProvider';

interface FilterHeaderProps {
    handleMapVisibility: () => void;
}

export function FilterHeader({handleMapVisibility}: FilterHeaderProps) {
    const { budget, activeTeam } = useTeamContext();

    return (
            <div className={classes.container}>
                <h2 className={classes.header}>
                    <IconArrowLeft size={28} style={{marginRight: '10px'}} stroke={2} className={classes.arrowIcon} onClick={handleMapVisibility}/>
                    Ryttermarked
                </h2>
                <div className={classes.shelfContainer}>
                    <p>{budget}m /100m</p>
                    <p>{activeTeam.filter(r => !r.undefined).length} /13</p>
                </div>
            </div>
    );
}