import React from 'react';

import { Loader } from '@mantine/core';
import classes from '@/styles/GlobalLoader.module.css';

export const GlobalLoader = () => {
    return (
        <div className={classes.globalLoader}>
            <div className={classes.innerWrapper}>
                <Loader
                    color='yellow'
                    type='bars'
                    className={classes.loader}
                >
                </Loader>
                <p style={{marginTop: 20}}>Laster Tourhjelper...</p>
            </div>
        </div>
    );
}