import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';

const yellow: MantineColorsTuple = [
    "#fffce1",
    "#fff8cc",
    "#fff19b",
    "#ffea64",
    "#ffe338",
    "#ffdf1d",
    "#ffdd09",
    "#e3c400",
    "#c9ae00",
    "#ad9500"
]

const blue: MantineColorsTuple = [
    '#071524',
    '#122134',
    '#1b2b44',
    '#243b58',
    '#6585b2',
    '#5b7eaf',
    '#4a6c9a',
    '#40608a',
    '#1364a3',
    '#276faf'
];

export const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    colors: {
        yellow,
        blue
    },
    primaryColor: 'blue',
});