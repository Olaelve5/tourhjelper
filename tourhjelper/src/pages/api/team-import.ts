import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentStageServer } from "@/utils/getCurrentStageUtils";
import { Rider } from "@/types/Rider";
import { getRiderByNameServer } from "@/utils/riderUtilsServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const currentStage = getCurrentStageServer();

  const baseUrl = "https://tourmanager-game.api.scoutgg.net/fantasy_teams";

  try {
    const response = await fetch(`${baseUrl}/${id}?round=${currentStage}`, {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0",
        Accept: "application/json",
        "Accept-Language":
          "nb-NO,nb;q=0.9,no-NO;q=0.8,no;q=0.6,nn-NO;q=0.5,nn;q=0.4,en-US;q=0.3,en;q=0.1",
        "Content-Type": "application/json",
        Authorization: "Bearer tourmanager undefined",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      referrer: "https://tourmanager.no/",
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.statusText}`);
    }

    const data = await response.json();
    const assembledTeam = assembleTeam(data.realPlayers, data.playerChoices);

    const formattedTeam = {
      team: assembledTeam,
      transfersUsed: data.transferTotal || 0,
    };

    console.log("Formatted team:", formattedTeam);

    return res.status(200).json({
      team: JSON.stringify(formattedTeam),
    });
  } catch (error) {
    console.error("Error fetching team data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function assembleTeam(
  realPlayers: any[],
  playerChoices: any[]
): (Rider | undefined)[] {
  const riders: (Rider | undefined)[] = [];

  for (const playerChoice of playerChoices) {
    let fullName = "";

    const realPlayer = realPlayers.find(
      (p) => p.id === playerChoice?.realPlayerId
    );

    if (realPlayer.firstName && realPlayer.lastName) {
      fullName = `${realPlayer.firstName.trim()} ${realPlayer.lastName.trim()}`;
    } else if (realPlayer.lastName) {
      fullName = realPlayer.lastName.trim();
    } else {
      console.warn("Player has no name:", realPlayer);
      riders.push(undefined);
      continue;
    }

    // Remove extra whitespace
    fullName = fullName.replace(/\s+/g, " ").trim();

    const rider = getRiderByNameServer(fullName);

    if (!rider) {
      console.warn(`Rider not found: ${fullName}, continued with next`);
      continue;
    }

    riders.push(rider);
  }

  return riders;
}
