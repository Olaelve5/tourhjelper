import { Stage } from "@/types/Stage";

const chunkedStages = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
  [19, 20, 21],
];

const getLocalStageData = async () => {
  const response = await fetch("/data/stage_data.json");
  const stages = await response.json();
  return stages as Stage[];
};

export const fetchAllStages = async () => {
  const stages = await getLocalStageData();
  return stages;
};

export const fetchStageInfo = async (stage: number) => {
  const stages = await getLocalStageData();
  const stageData = stages.find((s) => s.stage === stage);
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
  const cachedStages = localStorage.getItem("stages");
  let stagesArray = [];
  if (cachedStages) {
    stagesArray = JSON.parse(cachedStages);
    const stageData = stagesArray.find((s: Stage) => s.stage === stage);
    if (stageData) return stageData;
  }
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

// utils/getCurrentStageUtils.client.ts
interface StageData {
  stage: number;
  date: string;
  start: string;
  distance: string;
  type: string;
  imageURL: string;
  lastUpdated: string;
}

export async function getCurrentStage(): Promise<number> {
  try {
    const response = await fetch("/data/stage_data.json");
    if (!response.ok) {
      throw new Error("Failed to fetch stage data");
    }

    const stages = await response.json();
    const now = new Date();
    const currentYear = now.getFullYear();
    let currentStage = 1;

    for (const stage of stages) {
      const [month, day] = stage.date.split("/").map(Number);
      const [hours, minutes] = stage.start.split(":").map(Number);

      const stageDateTime = new Date(
        currentYear,
        month - 1,
        day,
        hours,
        minutes
      );

      // If stage has started (current time is after stage start time)
      if (now >= stageDateTime) {
        currentStage = stage.stage;
      } else {
        break;
      }
    }

    return currentStage;
  } catch (error) {
    console.error("Error determining current stage:", error);
    return 1; // Default to stage 1 in case of error
  }
}
