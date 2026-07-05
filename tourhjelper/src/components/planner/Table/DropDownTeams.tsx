import React, {useState, useEffect, useMemo} from "react";

import { Menu, Image, Group, UnstyledButton } from '@mantine/core';
import classes from '@/styles/Table/DropDownTeams.module.css';
import { IconChevronDown } from '@tabler/icons-react';
import { useFilterContext } from "@/providers/FilterTableProvider";
import { useRiderContext } from "@/providers/RiderProvider";

interface TeamEntry {
  team: string;
  image: string;
}

export const DropDownTeams = () => {
  const { globalRiders } = useRiderContext();
  const { updateFilters, isReset } = useFilterContext();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<TeamEntry>({team: 'Alle lag', image: ''});

  // Derive unique teams from the riders DB data
  const teamEntries: TeamEntry[] = useMemo(() => {
    if (!globalRiders || globalRiders.length === 0) return [{team: 'Alle lag', image: ''}];

    const teamMap = new Map<string, string>();
    globalRiders.forEach((rider) => {
      if (rider.team && !teamMap.has(rider.team)) {
        teamMap.set(rider.team, rider.image_url || '');
      }
    });

    const entries: TeamEntry[] = [{team: 'Alle lag', image: ''}];
    Array.from(teamMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([team, image]) => entries.push({team, image}));

    return entries;
  }, [globalRiders]);

  useEffect(() => {
    if(isReset) {
      setSelected({team: 'Alle lag', image: ''});
    }
  }, [isReset]);

  const items = teamEntries.map(({team, image}) => (
    <Menu.Item
      leftSection={!image ? <Image src='/neutral-kit.webp' width={25} height={25} /> : <Image src={image} width={25} height={25} /> }
      onClick={() => {
        setSelected({team, image});
        if(team === 'Alle lag') {
          updateFilters('team', '');
          return;
        }
        updateFilters('team', team);
      }}
      key={team}
      className={classes.dropitem}
    >
      {team}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      shadow="md"
      width={'target'}
      transitionProps={{duration: 200, transition: 'fade'}}
    >
      <Menu.Target>
        <UnstyledButton className={classes.control}>
          <Group gap="xs">
            {!selected.image ? null : <Image src={selected.image} width={25} height={25} />}
            <span className={classes.label}>{selected.team}</span>
          </Group>
          <IconChevronDown size="1.1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>          
      <Menu.Dropdown className={classes.dropdown}>{items}</Menu.Dropdown>
    </Menu>
  );
};