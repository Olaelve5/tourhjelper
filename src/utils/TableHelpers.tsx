import { Rider } from '@/types/Rider';
import { Row } from '@/components/planner/Table/Row';
import { JSX } from 'react';

const scheme = {
    Kaptein: 2,
    Spurter: 2,
    Klatrer: 2,
    Ungdomsrytter: 2,
    Hjelperytter: 3,
    Temporytter: 1,
    Sportsdirektør: 1
}

const chunkSize = 10; // Number of rows per page

// This function takes an array and a size and splits the array into chunks of the given size.

export function chunk<T>(array: T[]): T[][] {
    if (!array.length) {
        return [];
    }
    const head = array.slice(0, chunkSize);
    const tail = array.slice(chunkSize);
    return [head, ...chunk(tail)];
} 


export function sortData<T extends { [key: string]: any }>(data: T[], type: string, isDesc: boolean): T[] {
    let newData = [];
    
    newData = data.sort((a, b) => {
        if (a[type] < b[type]) {
            return isDesc ? -1 : 1;
        }
        if (a[type] > b[type]) {
            return isDesc ? 1 : -1;
        }
        return 0;
    });

    if(type === 'price') {
        return newData;
    }
    return newData.reverse();
}


export const getRows = (data: Rider[][], page: number) => {
    if (!data.length || page < 1 || page > data.length) {
        return [];
    }
    let rows: JSX.Element[] = [];
    data[page - 1].forEach((rider) => {
        rows.push(<Row rider={rider} key={rider.name + rider.team + rider.price} />);
    });
    
    return rows;
}

export const checkIfRiderCanBeAdded = (rider: Rider, riderList: Rider[]) => {
    if (riderList.length >= 13) {
        return false;
    }

    if(riderList.some((r) => r.name === rider.name && r.team === rider.team && r.price === rider.price)) {
        return false;
    }

    if(riderList.filter((r) => r.category === rider.category).length >= scheme[rider.category]) {
        return false;
    }

    if (riderList.filter((r) => r.team === rider.team).length >= 3) {
        return false;
    }

    return true;
};

export const sortStringsAlphabetically = (data: string[]) => {
    return data.sort((a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
}

