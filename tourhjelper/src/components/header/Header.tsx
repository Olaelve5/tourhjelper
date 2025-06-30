"use client";
import { Container } from "@mantine/core";
import classes from "@/styles/Header.module.css";
import { IconBike } from "@tabler/icons-react";

export function Header() {
  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <h1 className={classes.logoTitle}>
          Tourhjelper
          <IconBike className={classes.logoIcon} />
        </h1>
      </Container>
    </header>
  );
}

export default Header;
