import React from 'react';

import { Button, Group } from '@mantine/core';
import classes from '@/styles/Map/SwitchViewButton.module.css';
import { IconShoppingCart } from '@tabler/icons-react';
import { useFilterContext } from '@/providers/FilterTableProvider';

interface SwitchViewButtonProps {
    handleMapVisibility: () => void;
}


export function SwitchViewButton({ handleMapVisibility }: SwitchViewButtonProps) {
    const { resetFilters, setPage } = useFilterContext();

    const handleClick = () => {
        setPage(1);
        resetFilters();
        setTimeout(() => {handleMapVisibility()}, 30);
    }

    return (
        <div className={classes.container}>
            <Button
            leftSection={<IconShoppingCart size={22} />}
            className={classes.button}
            onClick={handleClick}
            >
                Ryttermarked
            </Button>
        </div>
    );
}