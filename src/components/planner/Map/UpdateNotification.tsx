import React, { useState, useEffect } from 'react';
import { Notification } from '@mantine/core';
import classes from '@/styles/Map/Notification.module.css';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getDisplayName } from 'next/dist/shared/lib/utils';
import { get } from 'http';

interface UpdateNotificationProps {
    showUpdateNotification: boolean;
    success: boolean;
}


export function UpdateNotification({ showUpdateNotification, success }: UpdateNotificationProps) {
    const [display, setDisplay] = useState<boolean>(false);
    const style = showUpdateNotification ? { opacity: '1' } : { opacity: '0'};

    const getDisplayProperty = () => {
        if (display) {
            return 'flex';
        } else {
            return 'none';
        }
    };

    useEffect(() => {
        if (showUpdateNotification) {
            setDisplay(true);
        } else {
            setTimeout(() => {
                setDisplay(false);
            }, 300);
        }
    }, [showUpdateNotification]);

    return (
        <Notification
            color={success ? 'green' : 'red'}
            title={success ? 'Planen ble oppdatert' : 'Planen ble ikke oppdatert'}
            withBorder
            icon={success ? <IconCheck /> : <IconX />}
            classNames={classes}
            withCloseButton={false}
            style={style}
            display={getDisplayProperty()}
        />
    );
}