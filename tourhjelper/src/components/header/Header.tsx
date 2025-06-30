"use client";
import { Container } from "@mantine/core";
import classes from "@/styles/Header.module.css";

export function Header() {
  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <h1 className={classes.logoTitle}>Tourhjelper</h1>
      </Container>
    </header>
  );
}

export default Header;
