import React from "react";
import classes from "@/styles/Admin/admin.module.css";
import Login from "@/components/admin/login";

const admin = () => {
  return (
    <div className={classes.container}>
      <Login />
    </div>
  );
};

export default admin;
