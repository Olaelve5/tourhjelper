import { createContext, useEffect, useContext, useState } from "react";
import { calculateCurrentStage } from "@/utils/stageUtils";
import { useStages } from "@/hooks/useStages";

interface PlanStageContextType {
  activeStage: number;
  setActiveStage: (activeStage: number) => void;
}

// Create the context
export const StageContext = createContext<PlanStageContextType | null>(null);

// Create the hook to access the context
export const useStageContext = () => {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error("useStageContext must be used within a StageProvider");
  }
  return context;
};

// Create the provider
export function StageProvider({ children }: { children: React.ReactNode }) {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch the data inside the provider so we can calculate the date
  const { data: allStages } = useStages();

  useEffect(() => {
    // We only want to auto-set the stage once when the app loads (or data first arrives)
    // We prevent this from running again so we don't overwrite user navigation
    if (allStages && allStages.length > 0 && !isInitialized) {
      const currentStage = calculateCurrentStage(allStages);
      setActiveStage(currentStage);
      setIsInitialized(true);
    }
  }, [allStages, isInitialized]);

  return (
    <StageContext.Provider
      value={{
        activeStage,
        setActiveStage,
      }}>
      {children}
    </StageContext.Provider>
  );
}
