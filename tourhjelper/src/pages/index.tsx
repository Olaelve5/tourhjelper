import React from "react";
import Layout from "../app/layout";
import { Container } from "@mantine/core";
import { StageProvider } from "@/providers/StageProvider";
import MainPlanner from "@/components/planner/MainPlanner";
import MainStage from "@/components/stage/MainStage";
import PointsBarChart from "@/components/PointsBarChart";
import classes from "@/styles/MainPlanner.module.css";

const PlannerPage: React.FC = () => {
  return (
    <Layout>
      <StageProvider>
        <Container size="lg" className={classes.pageContainer}>
          <MainPlanner />
          <MainStage />
          <PointsBarChart />
        </Container>
      </StageProvider>
    </Layout>
  );
};

export default PlannerPage;
