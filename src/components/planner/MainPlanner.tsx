import React, {useState} from "react";

import { LoadingOverlay } from "@mantine/core";
import { Container, Grid } from '@mantine/core';
import CombinedProviders from "@/providers/CombinedProviders";
import { BtmButtonGroup } from "./BtmButtonGroup";
import { ImportTeamInput } from "./ImportTeamInput";
import { RidersMap } from "./Map/RidersMap";
import { PlanIndicator } from "./PlanIndicator";
import { FilterTable } from "./Table/FilterTable";
import classes from '@/styles/MainGrid.module.css';

const MainPlanner = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container size="lg" style={{padding: '0 7px'}}>
        <Grid>
            <CombinedProviders>
                <ImportTeamInput isLoading={isLoading} setIsLoading={setIsLoading}/>
                <div style={{display: 'flex', background: 'transparent', position: 'relative'}}>
                    <LoadingOverlay
                        visible={isLoading} 
                        zIndex={100000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                        loaderProps={{ color: 'yellow', type: 'bars' }}
                        transitionProps={{ transition: 'fade', duration: 0 }}
                        classNames={{ overlay: classes.overlay, root: classes.overlayRoot }}
                    />
                    <PlanIndicator/>
                    <Grid.Col span={{ base: 12, xs: 7.5 }} className={classes.mapTableColumn}>
                        <RidersMap />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 4.5 }} className={classes.mapTableColumn}>
                        <FilterTable />
                    </Grid.Col>
                </div>
            </CombinedProviders>
      </Grid>
    </Container>
  );
}

export default MainPlanner;