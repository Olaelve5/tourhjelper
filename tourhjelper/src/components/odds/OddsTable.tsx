import classes from "@/styles/Odds/OddsTable.module.css";
import { Table, Loader } from "@mantine/core";
import { useMemo, useState, useEffect } from "react";
import { IconStarFilled } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase";

// Define what our "Row" looks like for the UI
interface RiderData {
  name: string;
  odds: number;
  role: string;
  won: boolean;
  price: number;
}

type LocalRiderData = {
  name: string;
  category?: string;
  price?: number;
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`\"]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

const OddsTable = () => {
  const [currentStage] = useState(13); // Example stage
  const [data, setData] = useState<RiderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOdds();
  }, []);

  const fetchOdds = async () => {
    try {
      setLoading(true);

      const localRidersRes = await fetch("/data/rider_data.json");
      const localRidersJson = (await localRidersRes.json()) as LocalRiderData[];
      const localRiderMap = new Map<string, LocalRiderData>();
      localRidersJson.forEach((rider) => {
        if (rider?.name) {
          localRiderMap.set(normalizeName(rider.name), rider);
        }
      });

      // 1. Fetch GC odds from Supabase, sorted by newest first
      const { data: dbData, error } = await supabase
        .from("cycling_odds")
        .select("*")
        .eq("market_type", "GC_WINNER")
        .order("scraped_at", { ascending: false });

      if (error) throw error;

      // 2. Process data: Deduplicate to keep only the latest entry per rider
      const uniqueRiders = new Map<string, RiderData>();

      if (dbData) {
        dbData.forEach((row) => {
          // If we haven't seen this rider yet, add them (this will be the most recent entry)
          if (!uniqueRiders.has(row.rider_name)) {
            const localMatch = localRiderMap.get(normalizeName(row.rider_name));
            uniqueRiders.set(row.rider_name, {
              name: row.rider_name,
              odds: row.odds,
              role: localMatch?.category ?? "-",
              won: false, // Placeholder
              price: localMatch?.price ?? 0,
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

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.odds - b.odds);
  }, [data]);

  // Loading State
  if (loading) {
    return (
      <div
        className={classes.tableContainer}
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <Loader color="yellow" />
      </div>
    );
  }

  const rows =
    sortedData.length === 0
      ? [
          <Table.Tr key="empty">
            <Table.Td colSpan={4} className={classes.emptyState}>
              {error ? error : `Ingen odds tilgjengelig.`}
            </Table.Td>
          </Table.Tr>,
        ]
      : sortedData.map(({ name, odds, role, won, price }, index) => (
          <Table.Tr key={name}>
            <Table.Td className={classes.subtleInfo}>{index + 1}</Table.Td>
            <Table.Td>
              <div>{name}</div>
              <div className={classes.roleBelowName}>{role}</div>
            </Table.Td>
            {/* Price Column - Showing placeholder or formatted number */}
            <Table.Td align="center">
              {price > 0 ? price.toFixed(1) : "-"}
            </Table.Td>
            <Table.Td align="center">
              <div className={won ? classes.won : classes.odds}>
                {odds.toFixed(2)}{" "}
                {won && <IconStarFilled size={14} className={classes.star} />}
              </div>
            </Table.Td>
          </Table.Tr>
        ));

  return (
    <div className={classes.tableContainer}>
      <Table
        verticalSpacing={"xs"}
        withRowBorders={false}
        borderColor="var(--highlight-grey)"
        striped
        stripedColor="var(--light-grey)"
        stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th colSpan={4} className={classes.headerTitle}>
              Gul Trøye Vinnerodds
            </Table.Th>
          </Table.Tr>
          <Table.Tr className={classes.columnHeaderRow}>
            <Table.Th>#</Table.Th>
            <Table.Th>Rytter</Table.Th>
            <Table.Th className={classes.oddsTitle}>Pris</Table.Th>
            <Table.Th className={classes.oddsTitle}>Odds</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default OddsTable;
