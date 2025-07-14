import fs from "fs";
import path from "path";

interface StageData {
  stage: number;
  date: string;
  start: string;
  distance: string;
  type: string;
  imageURL: string;
  lastUpdated: string;
}

// Client-side version (browser)
export async function getCurrentStage(): Promise<number> {
  try {
    const response = await fetch("/data/stage_data.json");
    if (!response.ok) {
      throw new Error("Failed to fetch stage data");
    }
    const stages = await response.json();
    return getCurrentStageSync(stages);
  } catch (error) {
    console.error("Error determining current stage:", error);
    return 1;
  }
}

// Server-side version (API routes)
export function getCurrentStageServer(): number {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "stage_data.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const stages: StageData[] = JSON.parse(fileContents);
    return getCurrentStageSync(stages);
  } catch (error) {
    console.error("Error determining current stage:", error);
    return 1;
  }
}

// Shared logic for both client and server
export function getCurrentStageSync(stages: StageData[]): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  let currentStage = 1;

  for (const stage of stages) {
    const [month, day] = stage.date.split("/").map(Number);
    const [hours, minutes] = stage.start.split(":").map(Number);

    const stageDateTime = new Date(currentYear, month - 1, day, hours, minutes);

    // If stage has started (current time is after stage start time)
    if (now >= stageDateTime) {
      currentStage = stage.stage;
    } else {
      break;
    }
  }

  return currentStage;
}
