import React, { useEffect, useState } from "react";
import Layout from "../app/layout";
import { Container } from "@mantine/core";
import { StageProvider } from "@/providers/StageProvider";
import MainPlanner from "@/components/planner/MainPlanner";
import MainStage from "@/components/stage/MainStage";
import PointsBarChart from "@/components/PointsBarChart";
import OddsView from "@/components/odds/MainOddsView";
import classes from "@/styles/MainPlanner.module.css";
import ImportTeamInput from "@/components/import/ImportTeamInput";
import CombinedProviders from "@/providers/CombinedProviders";

const PlannerPage: React.FC = () => {
  return (
    <Layout>
      <StageProvider>
        <CombinedProviders>
          <Container size="lg" className={classes.pageContainer}>
            <ImportTeamInput />
            <MainPlanner />
            <MainStage />
            <OddsView />
          </Container>
        </CombinedProviders>
      </StageProvider>
    </Layout>
  );
};

export default PlannerPage;
