import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentStageServer } from "@/utils/getCurrentStageUtils";
import { Rider, RiderCategory } from "@/types/Rider";
import { getRiderByNameServer } from "@/utils/riderUtilsServer";
import { translateRiderCategory } from "@/utils/riderUtils";

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
    await fetch(`${baseUrl}/${id}?round=${currentStage}`, {
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
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch team data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Total transfers used:", data.transferTotal);

      console.log("Team:", data.realPlayers);
      console.log(
        "Full team: ",
        assembleTeam(data.realPlayers, data.fantasyPlayers)
      );
    });
  } catch (error) {
    console.error("Error fetching team data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function assembleTeam(realPlayers: any[], fantasyPlayers: any[]): Rider[] {
  const riders: Rider[] = [];

  for (const player of realPlayers) {
    const fullName =
      player.firstName != null
        ? player.firstName.trim() + " " + player.lastName.trim()
        : player.lastName.trim();

    console.log("Full name:", fullName);

    const rider = getRiderByNameServer(fullName);

    if (!rider) {
      console.warn(`Rider not found: ${player.name}`);
      const fantasyPlayerObject = fantasyPlayers.find(
        (fantasyPlayer) => fantasyPlayer.realPlayerId === player.id
      );
      const riderCategory = translateRiderCategory(
        fantasyPlayerObject?.position || "unknown"
      );

      // Create fallback rider with all required properties
      const fallbackRider: Rider = {
        name: player.name,
        team: player.team,
        category: riderCategory as RiderCategory,
        price: 0,
        points: 0,
        undefined: false,
      };

      riders.push(fallbackRider);
    } else {
      riders.push(rider);
    }
  }

  return riders;
}
