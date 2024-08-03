import { Plan } from '../types/Plan';

export const savePlansToSessionStorage = (plans: Plan[], userID: string | undefined) => {
    if(!userID) {
        sessionStorage.setItem('plans', JSON.stringify(plans));
        return;
    }
    sessionStorage.setItem(`plans_${userID}`, JSON.stringify(plans));
};

export const getPlansFromSessionStorage = () => {
    const savedPlans = sessionStorage.getItem('plans');
    const parsedPlans = savedPlans ? JSON.parse(savedPlans) : [];
    return parsedPlans;
};

export const getStageFromPlanFromStorage = async (planId: string, stage: number) => {
    const savedPlans = await getPlansFromSessionStorage();
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