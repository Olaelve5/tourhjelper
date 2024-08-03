import {useEffect} from 'react';

import { Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IconLink, IconUnlink } from '@tabler/icons-react';
import classes from '@/styles/Stage/MainStage.module.css';
interface LinkProps {
    setIsLinked: (value: boolean) => void;
}

export function Link({ setIsLinked }: LinkProps) {
    const [linked, toggle] = useToggle([true, false]);

    const getIcon = () => {
        if (linked) {
            return (
            <IconLink size={22} color='#fff' stroke={2} className={classes.linkIcon}/>
            );

        } else {
            return (
            <IconUnlink size={22} color='var(--icon-grey)' stroke={2} className={classes.linkIcon}/>
            );
        }
    }

    useEffect(() => {
        setIsLinked(linked);
    }, [linked, setIsLinked]);

    return (
        <Button
            onClick={() => toggle()}
            size='sm'
            className={classes.linkButton}
        >
            {getIcon()}
        </Button>
    );
}
