"use client";

import { useEffect, useState } from 'react';
import { Container, Group, Burger, useMantineTheme, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import { LogInButtons } from './user/LogInButtons';

const links = [
  { link: '/planner', label: 'Planlegger' },
  { link: '/stages', label: 'Etapper' },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState('/');
  const router = useRouter();

  const items = links.map((link) => (
    <a
    key={typeof link.label === 'string' ? link.label : 'user'}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  useEffect(() => {
    // Set the active link based on the current path
    const currentPath = router.pathname;
    const currentLink = links.find(link => link.link === currentPath);
    if (currentLink) {
      setActive(currentLink.link);
    }
  }, [router.pathname]);

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <h1 style={{cursor: 'pointer', zIndex: 1000}} onClick={(event) => {
          router.push('/');
        }}>Tourhjelper</h1>
        <Group gap={15} visibleFrom="xs" className={classes.middleLinksContainer}>
          {items[0]}
          {items[1]}
        </Group>
        <div style={{zIndex: '1000'}}>
          <LogInButtons />
        </div>
        

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" color='white'/>
        
        <Drawer
        opened={opened}
        onClose={toggle}
        size="100%"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000000}
        >
          <h1 style={{cursor: 'pointer'}} onClick={(event) => {
          router.push('/');
        }}>Tourhjelper</h1>
          <Group justify="center" grow pb="xl" px="md">
            {items}
          </Group>
        </Drawer>
      </Container>
    </header>
  );
}

export default Header;