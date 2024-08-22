import React, {useState} from "react";

import { LoadingOverlay } from "@mantine/core";
import { Container, Grid } from '@mantine/core';
import CombinedProviders from "@/providers/CombinedProviders";
import { ImportTeamInput } from "./ImportTeamInput";
import { RidersMap } from "./Map/RidersMap";
import { PlanIndicator } from "./PlanIndicator";
import { FilterTable } from "./Table/FilterTable";
import classes from '@/styles/MainPlanner.module.css';

const MainPlanner = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container size='lg' className={classes.container}>
            <CombinedProviders>
                <ImportTeamInput isLoading={isLoading} setIsLoading={setIsLoading}/>
                <div className={classes.loadingPlanContainer}>
                    <LoadingOverlay
                        visible={isLoading} 
                        zIndex={100000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                        loaderProps={{ color: 'yellow', type: 'bars' }}
                        transitionProps={{ transition: 'fade', duration: 0 }}
                        classNames={{ overlay: classes.overlay, root: classes.overlayRoot }}
                    />
                    <PlanIndicator/>
                    <div className={classes.mapTableContainer}>
                        <RidersMap />
                        <FilterTable />
                    </div>
                </div>
            </CombinedProviders>
    </Container>
  );
}

export default MainPlanner;