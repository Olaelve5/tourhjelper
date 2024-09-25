import { Plan } from '../types/Plan';

export const setStorageNotification = (value: boolean) => {
    try {
        localStorage.setItem('hideStorageNotification', value.toString());
    } catch (error) {
        console.error(error);
    }
}

export const getStorageNotification = () => {
    try {
        const value = localStorage.getItem('hideStorageNotification');
        if (value === null) {
            return false;
        }
        return value === 'true';
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const savePlansToLocalStorage = (plans: Plan[], userID: string | undefined) => {
    if(!userID) {
        localStorage.setItem('plans', JSON.stringify(plans));
        return;
    }
    localStorage.setItem(`plans_${userID}`, JSON.stringify(plans));
};

export const getPlansFromLocalStorage= () => {
    const savedPlans = localStorage.getItem('plans');
    const parsedPlans = savedPlans ? JSON.parse(savedPlans) : [];
    return parsedPlans;
};

export const getStageFromPlanFromStorage = async (planId: string, stage: number) => {
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