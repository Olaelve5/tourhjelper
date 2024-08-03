import React, {useState} from "react";

import { useTeamContext } from "@/providers/TeamProvider";
import { TextInput, ActionIcon, Loader } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconSearch, IconBike } from '@tabler/icons-react'
import classes from '@/styles/ImportTeamInput.module.css';
import { useRiderContext } from "@/providers/RiderProvider";
import { useMantineTheme } from "@mantine/core";

interface ImportTeamInputProps {
    // Define props here
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
}


export const ImportTeamInput = ({isLoading, setIsLoading}: ImportTeamInputProps) => {
    const theme = useMantineTheme();
    const { setActiveTeam, setSavedTransfers, setSavedTeam } = useTeamContext();
    const { globalRiders } = useRiderContext();
    const [value, setValue] = useInputState<string>('');
    const [isValidInput, setIsValidInput] = useState(true);

    const setRidersToImported = (importedRiders: any, transfers_used: string) => {
        setSavedTransfers(parseInt(transfers_used.split(' ')[0]));
        let riders = [];
        
        for (let i = 0; i < importedRiders.length; i++) {
            const rider = globalRiders?.find((r) => r.name.includes(importedRiders[i].name) && r.team === importedRiders[i].team);
            if (rider) {
                riders.push(rider);
            } else {
                console.log("rider not found: ", importedRiders[i]);
            }
        }
        setActiveTeam(riders);
    };

    const handleClick = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/team-import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: value }),
            });
            const data = await res.json();

            if (res.ok) {
                setValue('');
                const parsedTeam = JSON.parse(data.team);
                const { team: riders, transfers_used } = parsedTeam;
                
                // should be transfers_used below, this is a temporary fix
                setRidersToImported(riders, '5');
                setIsLoading(false);
                setIsValidInput(true);
            } else {
                console.error('Failed to import team');
                setIsValidInput(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setIsValidInput(false);
        }
    };

    return (
        <div className={classes.container}>
            <h1>Importer lag</h1>
            <TextInput
                radius="md"
                size="md"
                value={value}
                styles={{ input: { background: theme.colors.blue[2], border: 'none', color: 'white'} }}
                placeholder="Skriv inn ID"
                error={isValidInput ? null : 'Fant ikke ID'}
                rightSectionWidth={42}
                leftSection={<IconSearch size={22} stroke={1.5} />}
                rightSection={
                    <ActionIcon size={32}
                    radius="md" 
                    variant="filled"
                    color={theme.colors.yellow[6]}
                    onClick={handleClick}
                    >
                    {isLoading ? 
                    <Loader size="sm" type="dots" color={theme.colors.blue[0]}/> :
                    <IconBike size={22} stroke={1.5} color={theme.colors.blue[0]}/>
                    }
                    </ActionIcon>
                }
                onChange={(v) => {setValue(v), setIsValidInput(true)}}
            />
        </div>
    );
};