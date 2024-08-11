import { User } from "firebase/auth";
import { getPlansFromDB } from "./firebase/firebasePlanUtils";
import { generateUniqueId } from "./idUtils";

export const initializePlans = async (user: User | null) => {
    if (user) {
        try {
            const dbPlans = await getPlansFromDB(user.uid);

            if (dbPlans && dbPlans.length > 0) {
                return { plans: dbPlans, selectedPlanId: dbPlans[0].id };
            } else {
                const newPlan = { id: generateUniqueId(), name: 'Plan 1', stages: [] };
                return { plans: [newPlan], selectedPlanId: newPlan.id };
            }
        } catch (error) {
                console.error("Error fetching plans: ", error);
                return null;
        }
    }
    const newPlan = { id: generateUniqueId(), name: 'Plan 1', stages: [] };
    return { plans: [newPlan], selectedPlanId: newPlan.id };
}
