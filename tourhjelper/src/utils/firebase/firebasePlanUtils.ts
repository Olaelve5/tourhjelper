import { Plan } from '@/types/Plan';
import { doc, setDoc, collection, getDocs, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; 
import { Rider } from "@/types/Rider";
import { PlanStage } from "@/types/PlanStage";

export const updatePlanInDB = async (userId: string, planId: string, planName: string, riders: Rider[], transfers: number, stage: number) => {
    try {
        const plansRef = collection(doc(db, "users", userId), "plans");
        const planRef = doc(plansRef, planId);
        const stagesRef = collection(planRef, "stages");

        // Delete stages with higher stage number than the current stage
        await resetPlanFromStageInDB(userId, planId, stage);

        const stageRef = doc(stagesRef, stage.toString());
        const newStage = {
            riders: riders,
            transfers: transfers,
        };
        await setDoc(stageRef, newStage);
        await setDoc(planRef, { name: planName, userId: userId }, { merge: true });
    } catch(e) {
        console.error("Error updating document: " + e);
    }
};

export const resetPlanFromStageInDB = async (userId: string, planId: string, stage: number) => {
    try {
        const planRef = doc(collection(doc(db, "users", userId), "plans"), planId);
        const stagesRef = collection(planRef, "stages");

        // Delete stages with higher stage number than the given stage
        const querySnapshot = await getDocs(stagesRef);
        querySnapshot.forEach(async (doc) => {
            const stageNumber = parseInt(doc.id);
            if (stageNumber > stage) {
                await deleteDoc(doc.ref);
            }
        });
    } catch(e) {
        console.error("Error resetting document: " + e);
    }
};

export const getPlansFromDB = async (userID: string) => {
    let fetchedPlans: Plan[] = [];

    try {
        const plansRef = collection(doc(db, "users", userID), "plans");
        const plansSnapshot = await getDocs(plansRef);

        await Promise.all(plansSnapshot.docs.map(async (doc) => {
            let planToAdd: Plan = {} as Plan;
            planToAdd.id = doc.id;
            planToAdd.name = doc.data().name;
            planToAdd.stages = [];
            const stagesRef = collection(doc.ref, "stages");
            const stagesSnapshot = await getDocs(stagesRef);

            await Promise.all(stagesSnapshot.docs.map(async (doc) => {
                const stageToAdd: PlanStage = {
                    stage: parseInt(doc.id),
                    team: doc.data().riders,
                    transfers: doc.data().transfers,
                };
                planToAdd.stages.push(stageToAdd);
            }));
            fetchedPlans.push(planToAdd);
        }));
        console.log("Fetched plans: ", fetchedPlans);
        return fetchedPlans;
    } catch(e) {
        console.error("Error getting documents: " + e);
    }
};

export const deletePlanFromDB = async (userId: string, planId: string) => {
    try {
        const planRef = doc(collection(doc(db, "users", userId), "plans"), planId);
        await deleteDoc(planRef);
    } catch(e) {
        console.error("Error deleting document: " + e);
    }
};

export const changePlanNameInDB = async (userId: string, planId: string, newName: string) => {
    try {
        const planRef = doc(collection(doc(db, "users", userId), "plans"), planId);
        await setDoc(planRef, { name: newName }, { merge: true });
    } catch(e) {
        console.error("Error updating document: " + e);
    }
};

export const copyPlanInDB = async (userId: string, planIdToCopy: string, planIdToCopyTo: string) => {
    try {
        const planToCopyRef = doc(collection(doc(db, "users", userId), "plans"), planIdToCopy);
        const planToCopyToRef = doc(collection(doc(db, "users", userId), "plans"), planIdToCopyTo);
        const stagesToCopyRef = collection(planToCopyRef, "stages");
        const stagesToCopyToRef = collection(planToCopyToRef, "stages");

        // Delete existing stages in the planToCopyTo using batch
        const existingStagesSnapshot = await getDocs(stagesToCopyToRef);
        const batch = writeBatch(db);
        existingStagesSnapshot.docs.forEach((stageDoc) => {
            batch.delete(stageDoc.ref);
        });

        // Copy stages from planToCopy to planToCopyTo using batch
        const stagesSnapshot = await getDocs(stagesToCopyRef);
        stagesSnapshot.docs.forEach((stageDoc) => {
            const stageRef = doc(stagesToCopyToRef, stageDoc.id);
            batch.set(stageRef, stageDoc.data());
        });

        // Commit the batch
        await batch.commit();
        
    } catch(e) {
        console.error("Error copying document: " + e);
    }
};