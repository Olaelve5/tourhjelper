import { Stage } from "@/types/Stage";

/**
 * Determines the active stage based on the current date and time.
 * Expects the full array of stages from the database.
 */
export function calculateCurrentStage(stages: Stage[]): number {
  if (!stages || stages.length === 0) return 1;

  const now = new Date();
  const currentYear = now.getFullYear();

  for (const stage of stages) {
    const [month, day] = stage.date.split("/").map(Number);
    const [hours, minutes] = stage.start_time.split(":").map(Number);

    const stageDateTime = new Date(
      currentYear,
      month - 1, // Month is 0-indexed in JS
      day,
      hours,
      minutes,
    );

    // If the current time is BEFORE this stage's start time,
    // then this is the active/upcoming stage.
    if (now < stageDateTime) {
      return stage.stage_number;
    }
  }

  // If all stages have passed, return the last stage (21)
  return 21;
}
