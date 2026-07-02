import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useRiderContext } from "@/providers/RiderProvider";
import { Rider } from "@/types/Rider";

export interface RiderData {
  name: string;
  odds: number;
  role: string;
  won: boolean;
  price: number;
  team: string;
}

// Standardiserer navn til fornavn + etternavn (uten aksenter, tegnsetting, casing).
const standardizeName = (value: string): string => {
  const cleaned = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\b(team|pro cycling|cycling team|cycling|pro team|racing)\b/g, " ")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`".,\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

export const useOddsData = () => {
  const { globalRiders } = useRiderContext();
  const [data, setData] = useState<RiderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualStage, setActualStage] = useState<number | null>(null);

  // NEW: State to hold the formatted timestamp
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    // Vent til riderne er hentet fra provideren.
    if (!globalRiders) return;

    const fetchOdds = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Find the absolute latest stage available in the DB
        const { data: latestData, error: latestError } = await supabase
          .from("cycling_odds")
          .select("stage_number")
          .eq("market_type", "STAGE_WINNER")
          .not("stage_number", "is", null)
          .order("stage_number", { ascending: false })
          .limit(1);

        if (latestError) throw latestError;

        const targetStage =
          latestData && latestData.length > 0
            ? latestData[0].stage_number
            : null;
        setActualStage(targetStage);

        // If the database is completely empty, stop here
        if (!targetStage) {
          setData([]);
          setLoading(false);
          return;
        }

        // 2. Build a lookup map keyed on standardized name from the riders
        //    already fetched by RiderProvider (ingen duplikat DB-kall).
        const riderMap = new Map<string, Rider>();
        globalRiders.forEach((rider) => {
          if (rider?.name) {
            riderMap.set(standardizeName(rider.name), rider);
          }
        });

        // 3. Fetch odds strictly for the targetStage
        const { data: dbData, error: dbError } = await supabase
          .from("cycling_odds")
          .select("*")
          .eq("market_type", "STAGE_WINNER")
          .eq("stage_number", targetStage)
          .order("scraped_at", { ascending: false });

        if (dbError) throw dbError;

        // 4. Extract the timestamp from the most recent row
        if (dbData && dbData.length > 0) {
          const rawTime = dbData[0].scraped_at.split("+")[0].replace("Z", "");
          const date = new Date(rawTime);

          const formattedDate = date.toLocaleString("no-NO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          setLastUpdated(formattedDate);
        }

        // 5. Process data: Deduplicate
        const uniqueRiders = new Map<string, RiderData>();

        if (dbData) {
          dbData.forEach((row) => {
            if (!uniqueRiders.has(row.rider_name)) {
              const match = riderMap.get(standardizeName(row.rider_name));
              uniqueRiders.set(row.rider_name, {
                name: row.rider_name,
                odds: row.odds,
                role: match?.category ?? "-",
                won: false,
                price: match?.price ?? 0,
                team: match?.team ?? "-",
              });
            }
          });
        }

        setData(Array.from(uniqueRiders.values()));
      } catch (err) {
        console.error("Error fetching odds:", err);
        setError("Kunne ikke laste odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [globalRiders]);

  return { data, loading, error, actualStage, lastUpdated };
};
