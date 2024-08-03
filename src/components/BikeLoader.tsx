import classes from '@/styles/Map/BikeLoader.module.css';



export function BikeLoader() {
    return (
        /* From Uiverse.io by fanishah */ 
            <div>
            <svg className={classes.loader} viewBox="0 0 48 30" width="48px" height="30px">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
                <g transform="translate(9.5,19)">
                <circle className={classes.loader_tire} r="9" stroke-dasharray="56.549 56.549"></circle>
                <g className={classes.loader_spokes_spin} stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
                    <circle className={classes.loader_spokes} r="5"></circle>
                    <circle className={classes.loader_spokes} r="5" transform="rotate(180,0,0)"></circle>
                </g>
                </g>
                <g transform="translate(24,19)">
                <g className={classes.loader_pedals_spin} stroke-dasharray="25.133 25.133" stroke-dashoffset="-21.991" transform="rotate(67.5,0,0)">
                    <circle className={classes.loader_pedals} r="4"></circle>
                    <circle className={classes.loader_pedals} r="4" transform="rotate(180,0,0)"></circle>
                </g>
                </g>
                <g transform="translate(38.5,19)">
                <circle className={classes.loader_tire} r="9" stroke-dasharray="56.549 56.549"></circle>
                <g className={classes.loader_spokes_spin} stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
                    <circle className={classes.loader_spokes} r="5"></circle>
                    <circle className={classes.loader_spokes} r="5" transform="rotate(180,0,0)"></circle>
                </g>
                </g>
                <polyline className={classes.loader_seat} points="14 3,18 3" stroke-dasharray="5 5"></polyline>
                <polyline className={classes.loader_body} points="16 3,24 19,9.5 19,18 8,34 7,24 19" stroke-dasharray="79 79"></polyline>
                <path className={classes.loader_handlebars} d="m30,2h6s1,0,1,1-1,1-1,1" stroke-dasharray="10 10"></path>
                <polyline className={classes.loader_front} points="32.5 2,38.5 19" stroke-dasharray="19 19"></polyline>
            </g>
            </svg>
        </div>
    )
}