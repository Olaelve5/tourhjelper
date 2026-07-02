import { Plan } from "../types/Plan";

const PLANS_STORAGE_KEY = "plans_26";
const LEGACY_PLANS_STORAGE_KEY = "plans";
const MIGRATION_FLAG_KEY = "plans_migration_2026";

export const setStorageNotification = (value: boolean) => {
  try {
    localStorage.setItem("hideStorageNotification", value.toString());
  } catch (error) {
    console.error(error);
  }
};

// Kjøres én gang ved app-start. Fjerner fjorårets "plans"-nøkkel slik at
// gamle lag/lagnavn ikke lekker inn i årets sesong.
export const migratePlansStorage = () => {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(MIGRATION_FLAG_KEY) === "done") return;
    localStorage.removeItem(LEGACY_PLANS_STORAGE_KEY);
    localStorage.setItem(MIGRATION_FLAG_KEY, "done");
  } catch (error) {
    console.error("Failed to migrate plans storage:", error);
  }
};

export const savePlansToLocalStorage = (plans: Plan[]) => {
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Failed to save plans to localStorage:", error);
  }
};

export const getPlansFromLocalStorage = () => {
  try {
    const savedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
    const parsedPlans = savedPlans ? JSON.parse(savedPlans) : [];
    return parsedPlans;
  } catch (error) {
    console.error("Failed to get plans from localStorage:", error);
    return [];
  }
};

export const getStageFromPlanFromStorage = async (
  planId: string,
  stage: number
) => {
  const savedPlans = await getPlansFromLocalStorage();
  const plan = savedPlans.find((p: Plan) => p.id === planId);
  if (!plan) {
    return null;
  }

  const stageData = plan.stages.find((s: any) => s.stage === stage);
  if (!stageData) {
    return null;
  }

  return stageData;
};

export const saveIdToLocalStorage = (id: string) => {
  try {
    localStorage.setItem("importTeamId", id);
  } catch (error) {
    console.error("Failed to save imported team ID to localStorage:", error);
  }
};

export const getIdFromLocalStorage = () => {
  try {
    const id = localStorage.getItem("importTeamId");
    return id ? id : "";
  } catch (error) {
    console.error("Failed to get imported team ID from localStorage:", error);
    return "";
  }
};
