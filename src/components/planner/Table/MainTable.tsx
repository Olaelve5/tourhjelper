import React, {useState, useEffect} from 'react';

import { Table } from '@mantine/core';
import { applyFilters } from '@/utils/filterHelpers';
import { chunk, getRows, sortData } from '@/utils/TableHelpers';
import classes from '@/styles/Table/MainTable.module.css';
import { useFilterContext } from '@/providers/FilterTableProvider';
import { TablePagination } from './TablePagination';
import { useRiderContext } from '@/providers/RiderProvider';
import { SortIcon } from './SortIcon';


export function MainTable() {
  const { globalRiders } = useRiderContext();
  const { filters, isReset, page  } = useFilterContext();
  const [data, setData] = useState(chunk(sortData(globalRiders || [], 'price', false)));
  const [isSortedDesc, setIsSortedDesc] = useState(false);
  const [sortType, setSortType] = useState('price');

  const updateData = () => {
    setData(chunk(sortData(applyFilters(globalRiders || [], filters), sortType, isSortedDesc)));
  }

  useEffect(() => {
    updateData();
  }, [filters]);

  useEffect(() => {
    if (isReset) {
      setData(chunk(sortData(globalRiders || [], 'price', false)));
      setSortType('price');
      setIsSortedDesc(false);
      return;
    }

    updateData();
  }, [isReset, globalRiders]);

  const handleSort = (type: string) => {
    let newIsSortedDesc = isSortedDesc;
    if (type === sortType) {
      newIsSortedDesc = !isSortedDesc;
    } else {
      newIsSortedDesc = false;
      setSortType(type);
    }
    setIsSortedDesc(newIsSortedDesc);
    setData(chunk(sortData(applyFilters(globalRiders || [], filters), type, newIsSortedDesc)));
  };
  
  return (
    <div className={classes.container}>
      <Table miw={100} highlightOnHover horizontalSpacing={'xs'} className={classes.table} layout='fixed'>
        <Table.Thead>
          <Table.Tr style={{borderBottom: '1px solid var(--highlight-grey)'}}>
            <Table.Th className={classes.column1}></Table.Th>
            <Table.Th className={classes.column2} onClick={() => handleSort('name')}>
              <div className={classes.columnHeaderWrapper}>
                Rytter
                <SortIcon type='name' isSortedDesc={isSortedDesc} sortType={sortType}/>
              </div>
            </Table.Th>
            <Table.Th className={classes.column3} onClick={() => handleSort('category')}>
              <div className={classes.columnHeaderWrapper}>
                Kategori
                <SortIcon type='category' isSortedDesc={isSortedDesc} sortType={sortType}/>
              </div>
            </Table.Th>
            <Table.Th className={classes.column4} onClick={() => handleSort('price')}>
              <div className={classes.columnHeaderWrapper}>
                Pris
                <SortIcon type='price' isSortedDesc={isSortedDesc} sortType={sortType}/>
              </div>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody style={{height: '100%'}}>
          {getRows(data, page).length === 0 ? <Table.Tr><Table.Td colSpan={4} style={{textAlign: 'center'}}>Ingen ryttere funnet</Table.Td></Table.Tr> : null}
          {getRows(data, page)}
        </Table.Tbody>
      </Table>
      <TablePagination data={data}/>
    </div>
  );
}