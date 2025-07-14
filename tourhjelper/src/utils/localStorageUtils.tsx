import { Plan } from "../types/Plan";

export const setStorageNotification = (value: boolean) => {
  try {
    localStorage.setItem("hideStorageNotification", value.toString());
  } catch (error) {
    console.error(error);
  }
};

export const savePlansToLocalStorage = (plans: Plan[]) => {
  try {
    localStorage.setItem("plans", JSON.stringify(plans));
  } catch (error) {
    console.error("Failed to save plans to localStorage:", error);
  }
};

export const getPlansFromLocalStorage = () => {
  try {
    const savedPlans = localStorage.getItem("plans");
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
