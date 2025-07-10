import { createContext, useEffect, useContext, useState } from "react";
import { getCurrentStage } from "@/utils/stageUtils";

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
    throw new Error(
      "usePlanStageContext must be used within a PlanStageProvider"
    );
  }
  return context;
};

// Create the provider
export function StageProvider({ children }: { children: React.ReactNode }) {
  const [activeStage, setActiveStage] = useState<number>(1);

  // Load current stage on mount
  useEffect(() => {
    async function loadCurrentStage() {
      try {
        const currentStage = await getCurrentStage();
        setActiveStage(currentStage);
      } catch (error) {
        console.error(
          "Failed to load current stage, defaulting to stage 1:",
          error
        );
        setActiveStage(1);
      }
    }
    loadCurrentStage();
  }, []);

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
