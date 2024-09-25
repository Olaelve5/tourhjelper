import React from "react";
import { TeamProvider } from "@/providers/TeamProvider";
import { PlanProvider } from "@/providers/PlanProvider";
import { RiderProvider } from "@/providers/RiderProvider";
import { FilterProvider } from "@/providers/FilterTableProvider";

function CombinedProviders({ children }: { children?: React.ReactNode }) {
  return (
      <RiderProvider>
        <PlanProvider>
          <TeamProvider>
            <FilterProvider>
              {children}
            </FilterProvider>
          </TeamProvider>
        </PlanProvider>
      </RiderProvider>
  );
};

export default CombinedProviders;