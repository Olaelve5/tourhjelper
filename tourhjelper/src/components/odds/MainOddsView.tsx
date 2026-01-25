import React from "react";
import classes from "@/styles/Odds/MainOddsView.module.css";
import { Container, Title } from "@mantine/core";
import OddsTable from "./OddsTable";

const MainOddsView = () => {
  return (
    <Container size="lg" className={classes.container}>
      <div className={classes.headerContainer}>
        <h3>Siste resultater & odds</h3>
      </div>
      <OddsTable />
    </Container>
  );
};

export default MainOddsView;
