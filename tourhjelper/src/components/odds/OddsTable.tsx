import classes from "@/styles/Odds/OddsTable.module.css";
import { Table, Loader, Button, Pagination } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks"; // Lytter til skjermbredde
import { useMemo, useState, useEffect } from "react";
import { IconStarFilled, IconTextPlus } from "@tabler/icons-react";
import { RiderData } from "@/hooks/useOddsData";
import { useRiderContext } from "@/providers/RiderProvider";

interface OddsTableProps {
  data: RiderData[];
  loading: boolean;
  error: string | null;
}

const ITEMS_PER_PAGE = 14;

const OddsTable = ({ data, loading, error }: OddsTableProps) => {
  // State for mobil (load more)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // State for desktop (pagination)
  const [page, setPage] = useState(1);

  // Sjekker om skjermen er over 900px bred (returnerer true/false)
  const isDesktop = useMediaQuery("(min-width: 900px)");

  const { riderImages } = useRiderContext();

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.odds - b.odds);
  }, [data]);

  // Nullstill sidenummer/antall hvis dataene endres (f.eks. bytter etappe)
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setPage(1);
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

  // LOGIKKEN: Beregn hvilke data som skal vises basert på skjermbredde
  const visibleData = isDesktop
    ? sortedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) // Paginerings-logikk
    : sortedData.slice(0, visibleCount); // Load-more logikk

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const rows =
    visibleData.length === 0
      ? [
          <Table.Tr key="empty">
            <Table.Td colSpan={4} className={classes.emptyState}>
              {error ? error : `Ingen odds tilgjengelig.`}
            </Table.Td>
          </Table.Tr>,
        ]
      : visibleData.map(({ name, odds, role, won, price, team }) => (
          <Table.Tr key={name}>
            <Table.Td style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  riderImages.find((img) => img.team === team)?.image ||
                  "neutral-kit.webp"
                }
                alt="rider"
                className={classes.riderImage}
              />
              <div>
                <div>{name}</div>
                <div className={classes.roleBelowName}>{team}</div>
              </div>
            </Table.Td>
            <Table.Td align="center">
              <div>{price > 0 ? price.toFixed(1) : "-"}m</div>
              <div className={classes.roleBelowName}>{role}</div>
            </Table.Td>
            <Table.Td align="center">
              <div className={won ? classes.won : classes.odds}>
                {odds.toFixed(1)}{" "}
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
        striped={false}
        stripedColor="var(--light-grey)">
        <Table.Thead>
          <Table.Tr className={classes.columnHeaderRow}>
            <Table.Th>Rytter</Table.Th>
            <Table.Th className={classes.oddsTitle}>Info</Table.Th>
            <Table.Th className={classes.oddsTitle}>Odds</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* --- KONTROLLER FOR BUNNEN AV TABELLEN --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
          marginTop: "auto",
        }}>
        {isDesktop
          ? // DESKTOP: Vis Mantine Pagination
            totalPages > 1 && (
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
                classNames={classes}
                size="sm"
                withControls
                siblings={1}
              />
            )
          : // MOBIL: Vis "Load More" knappen
            visibleCount < sortedData.length && (
              <Button
                color="yellow"
                className={classes.loadMoreButton}
                fullWidth
                style={{ maxWidth: "200px" }}
                onClick={() =>
                  setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                }>
                Vis flere rader
                <IconTextPlus size={20} style={{ marginLeft: "0.5rem" }} />
              </Button>
            )}
      </div>
    </div>
  );
};

export default OddsTable;
