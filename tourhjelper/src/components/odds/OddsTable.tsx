import classes from "@/styles/Odds/OddsTable.module.css";
import { Table } from "@mantine/core";

const mock_data = {
  "Tadej Pogacar": 1.5,
  "Primoz Roglic": 2.0,
  "Geraint Thomas": 3.5,
  "Egan Bernal": 4.0,
  "Richard Carapaz": 5.0,
  "Wout van Aert": 6.0,
  "Julian Alaphilippe": 7.0,
  "Mathieu van der Poel": 8.0,
  "Remco Evenepoel": 9.0,
  "Tom Pidcock": 10.0,
};

const OddsTable = () => {
  const rows = Object.entries(mock_data).map(([name, odds]) => (
    <Table.Tr key={name}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{odds.toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={classes.tableContainer}>
      <Table
        verticalSpacing={"sm"}
        withRowBorders={true}
        withColumnBorders
        withTableBorder
        borderColor="var(--highlight-grey)"
        striped
        stripedColor="var(--light-grey)">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rytter</Table.Th>
            <Table.Th>Odds</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <div className={classes.updateInfo}>Sist oppdatert 25.01 kl 22.20</div>
    </div>
  );
};

export default OddsTable;
