import React, { useState } from 'react';
import { Checkbox, Notification } from '@mantine/core';
import classes from '@/styles/StorageNotification.module.css';
import { setStorageNotification } from '@/utils/localStorageUtils';

interface StorageNotificationProps {
    setHideStorageNotification: (value: boolean) => void;
}

export function StorageNotification({ setHideStorageNotification }: StorageNotificationProps) {
    const [checked, setChecked] = useState(false);

    const handleClose = () => {
        setHideStorageNotification(true);
        setStorageNotification(checked);   
    }

    return (
        <Notification
            color="red"
            title="Inkonsistent lagring"
            classNames={classes}
            onClose={handleClose}
            withBorder
        >
            <div>
                Du risikerer å miste planene dine når du lukker fanen. 
                Venligst lag en bruker for å lagre planene dine over tid.
            </div>
            <div>
                <Checkbox
                    label='Ikke vis denne meldingen igjen'
                    color='yellow'
                    iconColor='white'
                    onChange={(event) => setChecked(event.currentTarget.checked)}
                    classNames={{
                        root: classes.checkboxRoot,
                        label: classes.checkboxLabel,
                        input: classes.checkboxInput,
                        icon: classes.checkboxIcon,
                    }}
                />
            </div>
        </Notification>
    );
}