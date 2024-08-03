import { User } from "firebase/auth";
import { getPlansFromDB } from "./firebaseUtils";
import { generateUniqueId } from "./idUtils";

export const initializePlans = async (user: User | null) => {
    if (user) {
        const cachedPlans = sessionStorage.getItem(`plans_${user.uid}`);
        if (cachedPlans && JSON.parse(cachedPlans).length > 0) {
            return { plans: JSON.parse(cachedPlans), selectedPlanId: JSON.parse(cachedPlans)[0].id };
        }

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

export const availableColors = {
    blue: '#1364a3',
    yellow: '#ffdd09',
    orange: '#ff7409',
    purple: '#7809ff',
    teal: '#09ff94'
};

