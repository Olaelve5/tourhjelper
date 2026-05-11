import React from "react";
import classes from "@/styles/Odds/MainOddsView.module.css";
import { Container } from "@mantine/core";
import OddsTable from "./OddsTable";
import { IconCardsFilled } from "@tabler/icons-react";
import { useOddsData } from "@/hooks/useOddsData";

const MainOddsView = () => {
  const { data, loading, error, actualStage, lastUpdated } = useOddsData();

  return (
    <Container size="lg" className={classes.container}>
      <div className={classes.headerContainer}>
        <IconCardsFilled size={28} style={{ marginRight: "10px" }} />
        {/* Dynamically show the stage number */}
        <h3>Odds Etappe {actualStage ?? "..."}</h3>
      </div>

      {/* Dynamically show the exact timestamp the script ran */}
      <div className={classes.updateContainer}>
        Oppdatert: {lastUpdated ?? "Laster..."}
      </div>

      <OddsTable data={data} loading={loading} error={error} />
    </Container>
  );
};

export default MainOddsView;
