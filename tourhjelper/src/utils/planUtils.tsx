import { generateUniqueId } from "./idUtils";
import { getPlansFromLocalStorage } from "./localStorageUtils";

export const initializePlans = async () => {
    const localPlans = getPlansFromLocalStorage();
    if (localPlans && localPlans.length > 0) {
        return { plans: localPlans, selectedPlanId: localPlans[0].id };
    }

    const newPlan = { id: generateUniqueId(), name: 'Plan 1', stages: [] };
    return { plans: [newPlan], selectedPlanId: newPlan.id };
}
