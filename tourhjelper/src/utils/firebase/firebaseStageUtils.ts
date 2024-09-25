import { doc, setDoc, collection, getDocs, deleteDoc, writeBatch, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; 
import { Stage } from "@/types/Stage";

export const getStageFromDB = async (stage: number) => {
    try {
        const stageRef = doc(collection(db, "stages"), stage.toString());
        const stageDoc = await getDoc(stageRef);
        if (stageDoc.exists()) {
            return stageDoc.data() as Stage;
        } else {
            console.error("No such document!");
        }
    } catch(e) {
        console.error("Error getting document: " + e);
    }
}

export const getStageChunkFromDB = async (chunk: number[]) => {
    try {
        const stages = chunk.map(stage => doc(collection(db, "stages"), stage.toString()));
        const stageDocs = await Promise.all(stages.map(stageRef => getDoc(stageRef)));
        const stageData = stageDocs.map(doc => doc.data() as Stage);
        return stageData;
    } catch(e) {
        console.error("Error getting document: " + e);
        throw e; // Rethrow the error after logging
    }
}

export const getStageTimestamps = async () => {
    try {
        const stageRef = collection(db, "stages");
        const stageDocs = await getDocs(stageRef);
        const timestamps = stageDocs.docs.map(doc => ({
            lastUpdated: doc.data().lastUpdated,
            stage: doc.data().stage
        }));
        return timestamps;
    } catch(e) {
        console.error("Error getting document: " + e);
    }
}