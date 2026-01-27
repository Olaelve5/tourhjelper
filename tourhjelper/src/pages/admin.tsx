import React, { useState, useEffect } from "react";
import classes from "@/styles/Admin/admin.module.css";
import Login from "@/components/admin/login";
import Dashboard from "@/components/admin/dashboard";
import { supabase } from "@/utils/supabase";
import { Loader } from "@mantine/core";

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session immediately when page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
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

  // Show a spinner while we ask Supabase "Is he logged in?"
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}>
        <Loader color="blue" />
      </div>
    );
  }

  // If no session (not logged in) -> Show Login Form
  if (!session) {
    return (
      <div className={classes.container}>
        <Login />
      </div>
    );
  }

  // If session exists (logged in) -> Show Dashboard
  return (
    <div className={classes.container}>
      <Dashboard />
    </div>
  );
};

export default Admin;
