import React from 'react';

import { Loader } from '@mantine/core';
import classes from '@/styles/GlobalLoader.module.css';
import { BikeLoader } from './BikeLoader';

export const GlobalLoader = () => {
    return (
        <div className={classes.globalLoader}>
            <div className={classes.innerWrapper}>
                <Loader
                    size={48}
                    color='yellow'
                    type='bars'
                >
                </Loader>
                <p style={{marginTop: 20}}>Laster Tourhjelper...</p>
            </div>
        </div>
    );
}