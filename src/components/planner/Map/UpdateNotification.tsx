import { Notification } from '@mantine/core';
import classes from '@/styles/Map/Notification.module.css';


export function UpdateNotification() {
    return (
        <Notification
            color="green"
            title="Planen ble oppdatert"
            withBorder
            classNames={classes}
            withCloseButton={false}
        >
        </Notification>
    );
}

export function UpdateNotificationFail() {
    return (
        <Notification
            color="red"
            title="Planen ble ikke oppdatert"
            withBorder
            classNames={classes}
            withCloseButton={false}
        >
            Noe gikk galt
        </Notification>
    );
}