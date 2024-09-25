import React, {useEffect, useState} from 'react';
import { Table } from '@mantine/core';
import { Rider } from '@/types/Rider';
import { IconSquarePlus, IconSquareCheckFilled, IconSquareMinusFilled } from '@tabler/icons-react';
import classes from '@/styles/Table/Row.module.css';
import { useTeamContext } from '@/providers/TeamProvider';
import { validateUpdate } from '@/utils/MapHelpers';
import { useRiderContext } from '@/providers/RiderProvider';

export function Row({rider}: {rider: Rider}) {
    const { addRider, removeRider, activeTeam, budget } = useTeamContext();
    const { riderImages } = useRiderContext();
    const [selected, setSelected] = useState(false);
    const canBeAdded = validateUpdate(activeTeam, rider);

    useEffect(() => {
      const activeRiders = activeTeam.filter(r => !r.undefined);
      setSelected(activeRiders.some((r) => r.name === rider.name && r.team === rider.team && r.price === rider.price));
    }, [activeTeam]);

    const handleClick = () => {
      if(selected) {
        removeRider(rider);
        return;
      }
      if(canBeAdded) addRider(rider);
    }

    const getCategoryAbbreviation = (category: string) => {
      switch(category) {
        case 'Sportsdirektør':
          return 'Direktør';
        case 'Ungdomsrytter':
          return 'Ungdom';
        case 'Temporytter':
          return 'Tempo';
      }
      return category;
    };

    const getShortenedName = () => {
      if(rider.category === 'Sportsdirektør') return rider.name;
      const names = rider.name.split(' ');
      names[0] = names[0].charAt(0) + '.';
      return names.join(' ');
    };

    const imageUrl = riderImages.find(img => img.team === rider.team)?.image || 'neutral-kit.webp';

    return (
        <Table.Tr key={rider.name + rider.team + rider.price}
          className={selected ? classes.selectedRow : (canBeAdded ? classes.row : classes.disabledRow)} 
          onClick={handleClick}>
            <Table.Td style={{lineHeight: '100%'}}>
              {selected ? 
              <>
                <IconSquareCheckFilled size={22} color='white' className={classes.check}/>
                <IconSquareMinusFilled size={22} color='white' className={classes.minus}/>
              </>
              :
              canBeAdded &&
                <IconSquarePlus size={22} color='#cccccc'/>
              }
            </Table.Td>
            <Table.Td>
              <div style={{display: 'flex', alignContent: 'center'}}>
                <img src={imageUrl} alt="rider" className={classes.riderImage}/>
                <div style={{lineHeight: 1.4}}>
                  <div className={classes.name}>{getShortenedName()}</div>
                  <div className={canBeAdded ? classes.team : (selected ? classes.teamSelected : classes.teamDisabled)}>{rider.team}</div>
                </div>
              </div>
            </Table.Td>
            <Table.Td className={classes.categoryPrice}>{getCategoryAbbreviation(rider.category)}</Table.Td>
            <Table.Td className={rider.price <= budget ? classes.categoryPrice : (canBeAdded ? classes.priceDisabled : classes.categoryPrice)}>{rider.price}m</Table.Td>
          </Table.Tr>
    )
}