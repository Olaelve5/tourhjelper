// utils/riderUtils.server.ts
import { Rider } from "@/types/Rider";
import fs from "fs";
import path from "path";

export function getRidersServer(): Rider[] {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "rider_data.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents) as Rider[];
  } catch (error) {
    console.error("Error reading rider data:", error);
    return [];
  }
}

export function getRiderByNameServer(name: string): Rider | undefined {
  if (!name || typeof name !== "string") {
    console.warn(`Invalid name provided to getRiderByNameServer: ${name}`);
    return undefined;
  }

  const riders = getRidersServer();
  return riders.find(
    (rider) => rider.name.toLowerCase() === name.toLowerCase()
  );
}
