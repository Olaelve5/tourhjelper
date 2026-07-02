import React, { useEffect, useState } from "react";
import Layout from "../app/layout";
import { Container } from "@mantine/core";
import { StageProvider } from "@/providers/StageProvider";
import MainPlanner from "@/components/planner/MainPlanner";
import MainStage from "@/components/stage/MainStage";
import OddsView from "@/components/odds/MainOddsView";
import classes from "@/styles/MainPlanner.module.css";
import ImportTeamInput from "@/components/import/ImportTeamInput";
import CombinedProviders from "@/providers/CombinedProviders";
import { useViewportSize } from "@mantine/hooks";

const PlannerPage: React.FC = () => {
  const { width } = useViewportSize();
  const isWideScreen = width >= 900;
  return (
    <Layout>
      <StageProvider>
        <CombinedProviders>
          <Container size="lg" className={classes.pageContainer}>
            {/* <ImportTeamInput /> */}
            <MainPlanner />
            <div
              style={{
                display: "flex",
                flexDirection: isWideScreen ? "row" : "column",
                gap: "0.8rem",
                marginTop: "4rem",
                justifyContent: "center",
                marginBottom: "2rem",
                alignItems: "stretch",
              }}>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <MainStage />
              </div>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <OddsView />
              </div>
            </div>
          </Container>
        </CombinedProviders>
      </StageProvider>
    </Layout>
  );
};

export default PlannerPage;
