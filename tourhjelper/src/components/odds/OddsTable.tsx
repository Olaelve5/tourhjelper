import classes from "@/styles/Odds/OddsTable.module.css";
import { Table, Loader, Button } from "@mantine/core";
import { useMemo, useState } from "react";
import { IconStarFilled, IconTextPlus } from "@tabler/icons-react";
import { RiderData } from "@/hooks/useOddsData";

// Define the expected props
interface OddsTableProps {
  data: RiderData[];
  loading: boolean;
  error: string | null;
}

const OddsTable = ({ data, loading, error }: OddsTableProps) => {
  const [visibleCount, setVisibleCount] = useState(15);

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
      : visibleData.map(({ name, odds, role, won, price }) => (
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

      {visibleCount < sortedData.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}>
          <Button
            color="yellow"
            className={classes.loadMoreButton}
            fullWidth
            style={{ maxWidth: "200px" }}
            onClick={() => setVisibleCount((prev) => prev + 15)}>
            Vis flere rader
            <IconTextPlus size={20} style={{ marginLeft: "0.5rem" }} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OddsTable;
