import React, { useState, useEffect } from 'react';

import { TextInput, Image, Button } from '@mantine/core';
import classes from '@/styles/Table/SearchBar.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useFilterContext } from '@/providers/FilterTableProvider';


export const SearchBar = () => {
    const [value, setValue] = useState('');
    const { updateFilters, isReset } = useFilterContext();

    useEffect(() => {
        if (isReset) {
            setValue('');
        }
    }, [isReset]);

    return (
        <TextInput
        placeholder="Søk"
        classNames={classes}
        value={value}
        size='xs'
        onChange={(event) => {
          setValue(event.currentTarget.value),
          updateFilters('name', event.currentTarget.value)
        }}
        autoComplete="nope"
        leftSection={<IconSearch color='white' width={20} height={20}/>}
      />
    )
};