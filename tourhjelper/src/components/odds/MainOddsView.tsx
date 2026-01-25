import React, { useState } from "react";
import classes from "@/styles/Odds/MainOddsView.module.css";
import { Container, Title } from "@mantine/core";
import OddsTable from "./OddsTable";
import ResultOddsToggle from "./ResultOddsToggle";

const MainOddsView = () => {
  const [showResults, setShowResults] = useState(false);

  return (
    <Container size="lg" className={classes.container}>
      {/* <div className={classes.headerContainer}>
        <h3>Siste resultater & odds</h3>
      </div> */}
      <ResultOddsToggle
        showResults={showResults}
        onToggle={(showResults) => setShowResults(showResults)}
      />
      <OddsTable />
      <div className={classes.updateInfo}>Sist oppdatert 25.01 kl 22.20</div>
    </Container>
  );
};

export default MainOddsView;
