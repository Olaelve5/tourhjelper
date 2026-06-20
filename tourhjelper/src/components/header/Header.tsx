"use client";
import { Container } from "@mantine/core";
import classes from "@/styles/Header.module.css";
import { IconBike } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import NavigationButton from "../admin/navigation_button";
import ThemeSwitcher from "./ThemeSwitcher";

export function Header() {
  const [session, setSession] = useState<any>(null);
  const themeSwitcherEnabled =
    process.env.NEXT_PUBLIC_THEME_SWITCHER === "true";

  useEffect(() => {
    // Check active session immediately when page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up a listener for changes (Log in / Log out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup listener when component is removed
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <h1 className={classes.logoTitle}>
          Tourhjelper
          <IconBike className={classes.logoIcon} />
        </h1>
        {themeSwitcherEnabled && <ThemeSwitcher />}
        {session && (
          <NavigationButton url_to_admin={true} label="Admin Dashboard" />
        )}
      </Container>
    </header>
  );
}

export default Header;
