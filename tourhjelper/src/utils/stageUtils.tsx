import { Stage } from "@/types/Stage";
import { getStageFromDB, getStageTimestamps } from "./firebase/firebaseStageUtils";


const chunkedStages = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18],
    [19, 20, 21]
]

const getLocalStageData = async () => {
    const response = await fetch('/data/stage_data.json');
    const stages = await response.json();
    return stages as Stage[];
};

export const fetchAllStages = async () => {
    const stages = await getLocalStageData();
    return stages;
};

export const fetchStageInfo = async (stage: number) => {
    const stages = await getLocalStageData();
    const stageData = stages.find(s => s.stage === stage);
    return stageData as Stage;
};

export const fetchStageChunk = async (stage: number) => {
    const chunk = chunkedStages.reduce((acc, curr) => {
        if (curr.includes(stage)) return curr;
        return acc;
    });
    const stages = [];

    for (let i = chunk[0]; i <= chunk[2]; i++) {
        const stageData = await fetchStageInfo(i);
        stages.push(stageData);
    }
    return stages;
};


// Functions below are used for fetching stage data from the database, but they are not used in the current implementation

export const fetchSingleStageInfo = async (stage: number) => {
    // Try local storage first
    const cachedStages = localStorage.getItem('stages');
    let stagesArray = [];
    if (cachedStages) {
        stagesArray = JSON.parse(cachedStages);
        const stageData = stagesArray.find((s: Stage) => s.stage === stage);
        if (stageData) return stageData;
    }

    // Fetch from DB
    const stageData = await getStageFromDB(stage);
    stagesArray.push(stageData);
    localStorage.setItem('stages', JSON.stringify(stagesArray));
    return stageData;
};

export const fetchMultipleStageInfo = async (stage: number) => {
    const chunk = chunkedStages.reduce((acc, curr) => {
        if (curr.includes(stage)) return curr;
        return acc;
    });
    const stages = [];

    for (let i = chunk[0]; i <= chunk[2]; i++) {
        const stageData = await fetchSingleStageInfo(i);
        stages.push(stageData);
    }
    return stages;
};

export const removeOutdatedStagesFromCache = async () => {
    const timestamps = await getStageTimestamps();

    const stagesArray = localStorage.getItem('stages');
    if (!stagesArray || !timestamps) return;

    const parsedStages = JSON.parse(stagesArray);
    if (!Array.isArray(parsedStages)) return;

    let updatedCachedStages = [];

    for (let i = 0; i < parsedStages.length; i++) {
        const cachedStage = parsedStages[i];
        if (!cachedStage) continue;

        const dbStage = timestamps.find(ts => ts.stage === cachedStage.stage);
        if (!dbStage) continue;
        if (dbStage.lastUpdated !== cachedStage.lastUpdated) continue;

        updatedCachedStages.push(cachedStage);
    }

    localStorage.setItem('stages', JSON.stringify(updatedCachedStages));
};