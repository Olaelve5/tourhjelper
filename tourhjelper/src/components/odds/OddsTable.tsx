import classes from "@/styles/Odds/OddsTable.module.css";
import { Table, Loader, Button } from "@mantine/core"; // Added Button here
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

  // NEW: State to track how many rows are visible
  const [visibleCount, setVisibleCount] = useState(15);

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

      // 1. Fetch STAGE_WINNER odds from Supabase, sorted by newest first
      const { data: dbData, error } = await supabase
        .from("cycling_odds")
        .select("*")
        .eq("market_type", "STAGE_WINNER")
        .order("scraped_at", { ascending: false });

      if (error) throw error;

      // 2. Process data: Deduplicate to keep only the latest entry per rider
      const uniqueRiders = new Map<string, RiderData>();

      if (dbData) {
        dbData.forEach((row) => {
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

  // NEW: Slice the sorted data based on the visible count
  const visibleData = sortedData.slice(0, visibleCount);

  const rows =
    visibleData.length === 0
      ? [
          <Table.Tr key="empty">
            <Table.Td colSpan={4} className={classes.emptyState}>
              {error ? error : `Ingen odds tilgjengelig.`}
            </Table.Td>
          </Table.Tr>,
        ]
      : visibleData.map(({ name, odds, role, won, price }, index) => (
          <Table.Tr key={name}>
            <Table.Td style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  "https://fantasy.assets.scoutgg.net/uploads/assets/36230.svg"
                }
                alt="rider"
                className={classes.riderImage}
              />
              <div>
                <div>{name}</div>
                <div className={classes.roleBelowName}>Uno-X Mobility</div>
              </div>
            </Table.Td>
            <Table.Td align="center">
              <div>{price > 0 ? price.toFixed(1) : "-"}m</div>
              <div className={classes.roleBelowName}>{role}</div>
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
        // Removed stickyHeader since we are expanding downwards instead of scrolling inside a container
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th colSpan={4} className={classes.headerTitle}>
              Stage Vinnerodds
            </Table.Th>
          </Table.Tr>
          <Table.Tr className={classes.columnHeaderRow}>
            <Table.Th>Rytter</Table.Th>
            <Table.Th className={classes.oddsTitle}>Info</Table.Th>
            <Table.Th className={classes.oddsTitle}>Odds</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* NEW: Load More Button */}
      {visibleCount < sortedData.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}>
          <Button
            variant="light"
            color="gray"
            fullWidth
            style={{ maxWidth: "200px" }}
            onClick={() => setVisibleCount((prev) => prev + 15)}>
            Vis 15 flere rader
          </Button>
        </div>
      )}
    </div>
  );
};

export default OddsTable;
