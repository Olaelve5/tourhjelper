import React from 'react';

import classes from '@/styles/Stage/Favorites.module.css';
import { IconStarFilled } from '@tabler/icons-react';

export function Favorites() {
    return (
        <div className={classes.container}>
            <div>
                <div className={classes.starContainer}>
                    <IconStarFilled size={20} className={classes.star}/>
                    <IconStarFilled size={20} className={classes.star}/>
                    <IconStarFilled size={20} className={classes.star}/>
                </div>
                <p>Pogacar, Evenepoel</p>
            </div>
            <div>
                <div className={classes.starContainer}>
                    <IconStarFilled size={20} className={classes.star}/>
                    <IconStarFilled size={20} className={classes.star}/>
                </div>
                <p>Vingegaard, Carapaz, A.Yates</p>
            </div>
            <div>
                <div className={classes.starContainer}>
                    <IconStarFilled size={20} className={classes.star}/>
                </div>
                <p>Bilbao, Poels, Johannesen, Roglic</p>
            </div>
        </div>
    );
}