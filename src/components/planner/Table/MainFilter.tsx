import React, {useState} from 'react';

import { Button, Tooltip } from '@mantine/core';
import { FilterBar } from './FilterBar';
import { DropDownTeams } from './DropDownTeams';
import { SearchBar } from './SearchBar';
import { IconArrowLeft, IconArrowNarrowLeft, IconArrowBackUp } from '@tabler/icons-react';
import { IconAdjustmentsOff } from '@tabler/icons-react';
import classes from '@/styles/Table/Filter.module.css';
import { useFilterContext } from '@/providers/FilterTableProvider';

interface MainFilterProps {
  handleMapVisibility: () => void;
}

export function MainFilter({handleMapVisibility}: MainFilterProps) {
  const { resetFilters } = useFilterContext();

  return (
    <div className={classes.container} style={{marginBottom: '10px'}}>
      <h2 className={classes.header}>
        <IconArrowLeft size={28} style={{marginRight: '10px'}} stroke={2} className={classes.arrowIcon} onClick={handleMapVisibility}/>
        Ryttermarked
        </h2>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 10px'}}>
        <div style={{display: 'grid', width: '100%', gridTemplateColumns: '80% 20%'}}>
          <SearchBar />
          <Tooltip label='Tilbakestill filtre'>
            <Button
              size='xs'
              className={classes.button}
              onClick={resetFilters}
            >
              <IconAdjustmentsOff size={20} color='white' style={{marginRight: '0px'}} stroke={2}/>
              {/* Tilbakestill */}
            </Button>
            </Tooltip>
        </div>
        <DropDownTeams />
        <FilterBar />
      </div>
    </div>
  );
};