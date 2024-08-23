import React from 'react';

import { Button, Group } from '@mantine/core';
import classes from '@/styles/Map/SwitchViewButton.module.css';
import { IconShoppingCart } from '@tabler/icons-react';

interface SwitchViewButtonProps {
    handleMapVisibility: () => void;
}


export function SwitchViewButton({ handleMapVisibility }: SwitchViewButtonProps) {
    return (
        <div className={classes.container}>
            <Button
            leftSection={<IconShoppingCart size={22} />}
            className={classes.button}
            onClick={handleMapVisibility}
            >
                Ryttermarked
            </Button>
        </div>
    );
}