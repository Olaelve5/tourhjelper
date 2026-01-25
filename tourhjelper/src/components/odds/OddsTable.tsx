import classes from "@/styles/Odds/OddsTable.module.css";
import { Table } from "@mantine/core";
import { useMemo, useState } from "react";
import { IconStarFilled } from "@tabler/icons-react";

const mock_data = [
  { name: "Tadej Pogacar", odds: 1.5, role: "KAP", won: false },
  { name: "Primoz Roglic", odds: 2.0, role: "KAP", won: false },
  { name: "Geraint Thomas", odds: 3.5, role: "KAP", won: false },
  { name: "Egan Bernal", odds: 4.0, role: "KL", won: false },
  { name: "Richard Carapaz", odds: 5.0, role: "KL", won: true },
  { name: "Wout van Aert", odds: 6.0, role: "HJ", won: false },
  { name: "Julian Alaphilippe", odds: 7.0, role: "KL", won: false },
  { name: "Mathieu van der Poel", odds: 8.0, role: "SPR", won: false },
  { name: "Remco Evenepoel", odds: 9.0, role: "TM", won: false },
  { name: "Tom Pidcock", odds: 10.0, role: "UNG", won: false },
  { name: "Jonas Vingegaard", odds: 2.25, role: "KL", won: false },
  { name: "Jasper Philipsen", odds: 12.0, role: "SPR", won: false },
  { name: "Mads Pedersen", odds: 14.0, role: "SPR", won: false },
  { name: "Mark Cavendish", odds: 18.0, role: "SPR", won: false },
  { name: "Matej Mohoric", odds: 16.5, role: "HJ", won: false },
  { name: "Filippo Ganna", odds: 20.0, role: "HJ", won: false },
  { name: "Carlos Rodriguez", odds: 22.0, role: "UNG", won: false },
  { name: "Joao Almeida", odds: 11.5, role: "KL", won: false },
  { name: "Enric Mas", odds: 24.0, role: "KL", won: false },
  { name: "Sepp Kuss", odds: 26.0, role: "HJ", won: false },
];

const OddsTable = () => {
  const [currentStage, setCurrentStage] = useState(13);
  const data = mock_data;

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.odds - b.odds);
  }, []);

  const rows =
    sortedData.length === 0
      ? [
          <Table.Tr key="empty">
            <Table.Td colSpan={4} className={classes.emptyState}>
              Ingen odds tilgjengelig for etappe {currentStage} ennå. Prøv å
              velge en annen etappe eller oppdater/importer data.
            </Table.Td>
          </Table.Tr>,
        ]
      : sortedData.map(({ name, odds, role, won }, index) => (
          <Table.Tr key={name}>
            <Table.Td className={classes.subtleInfo}>{index + 1}</Table.Td>
            <Table.Td>{name}</Table.Td>
            <Table.Td className={classes.subtleInfo}>{role}</Table.Td>
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
        verticalSpacing={"sm"}
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
            <Table.Th>Rolle</Table.Th>
            <Table.Th className={classes.oddsTitle}>Odds</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default OddsTable;
