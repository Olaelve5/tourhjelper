import React from 'react';
import { Box, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/styles/Stages/StageRow.module.css';
import {IconChevronDown} from '@tabler/icons-react';

export function StageRow() {
    const [opened, { toggle }] = useDisclosure(false);

    return (
        <Box className={classes.container}>
            <div onClick={toggle} className={classes.innerContainer}>
                <h3>Stage Title</h3>
                <IconChevronDown size={24} />
            </div>
            <Collapse in={opened} >
                <p>Stage 1</p>
            </Collapse>
        </Box>
    );
}