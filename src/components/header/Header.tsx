"use client";

import { useEffect, useState } from 'react';
import { Container, Group } from '@mantine/core';
import classes from '@/styles/Header.module.css';
import { useRouter } from 'next/router';
import { LogInButtons } from '../user/LogInButtons';
import HeaderDrawer from './HeaderDrawer';

const links = [
  { link: '/', label: 'Planlegger' },
  { link: '/stages', label: 'Etapper' },
];

export function Header() {
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
        <Group gap={15} visibleFrom="sm" className={classes.middleLinksContainer}>
          {items[0]}
          {items[1]}
        </Group>
        <Group style={{zIndex: '1000'}} visibleFrom='sm'>
          <LogInButtons />
        </Group>
        <HeaderDrawer active={active}/>
      </Container>
    </header>
  );
}

export default Header;