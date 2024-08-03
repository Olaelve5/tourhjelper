import React, {useState, useEffect} from "react";

import { Menu, Image, Group, UnstyledButton } from '@mantine/core';
import classes from '@/styles/Table/DropDownTeams.module.css';
import { IconChevronDown } from '@tabler/icons-react';
import { useFilterContext } from "@/providers/FilterTableProvider";
import { useRiderContext } from "@/providers/RiderProvider";

interface SelectedType {
  label: string | null;
  image: string | null;
}

export const DropDownTeams = () => {
  const { riderImages } = useRiderContext();
  const { updateFilters, isReset } = useFilterContext();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<SelectedType>({label: null, image: null});

  useEffect(() => {
    if(isReset) {
      setSelected(riderImages.length > 0 ? {label: riderImages[0].team, image: riderImages[0].image} : {label: null, image: null});
    }
  }, [isReset, riderImages]);

  useEffect(() => {
    if (riderImages.length > 0) {
      setSelected({label: riderImages[0].team, image: riderImages[0].image});
    }
  }, [riderImages]);

  const sortedTeams = () => {
    return riderImages.sort((a, b) => a.team.localeCompare(b.team));
  }

  const items = sortedTeams().map(({team, image}) => (
    <Menu.Item
      leftSection={image != null ? <Image src={image} width={25} height={25} /> : <Image src='/neutral-kit.webp' width={25} height={25} />}
      onClick={() => {
        setSelected({label: team, image: image});
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
            {selected.image == null ? null : <Image src={selected.image} width={25} height={25} />}
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size="1.1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>          
      <Menu.Dropdown className={classes.dropdown}>{items}</Menu.Dropdown>
    </Menu>
  );
};