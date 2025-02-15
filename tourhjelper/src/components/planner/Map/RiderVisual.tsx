import React, {useState} from 'react';

import Image from 'next/image';
import {IconCirclePlusFilled, IconXboxXFilled, IconSquareMinusFilled, IconSquareRoundedPlusFilled} from '@tabler/icons-react';
import classes from '@/styles/Map/RiderVisual.module.css';
import { useTeamContext } from "@/providers/TeamProvider";
import { useFilterContext } from '@/providers/FilterTableProvider';
import { useRiderContext } from '@/providers/RiderProvider';
import { Rider, RiderCategory } from '@/types/Rider';

interface RiderVisualProps {
  key: string;
  rider: Rider; // Ensure this matches the structure of your Rider type
}

export const RiderVisual: React.FC<RiderVisualProps> = ({ rider }) => {
  const {removeRider} = useTeamContext();
  const {riderImages} = useRiderContext();
  const {setFocusedCategory, setPage} = useFilterContext();


  const handleClick = () => {
    removeRider(rider);
    // setFocusedCategory(rider.category);
    // setPage(1);
  };

  const imageUrl = riderImages.find(img => img.team === rider.team)?.image || '/neutral-kit.webp';

  const getLastName = () => {
    if(rider.category === 'Sportsdirektør') return rider.name;
    const names = rider.name.split(' ');
    names.shift();
    return names.join(' ');
  };

  return (
    <div className={classes.container} onClick={handleClick}>
        <IconSquareMinusFilled size={16} className={classes.x} />
        <Image src={imageUrl} alt='EF' width='75' height={75} className={classes.kit}/>
        <div className={classes.infoContainer}>
            <div>
                <h4 className={classes.name}>{getLastName()}</h4>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', background: 'var(--light-grey)'}}>
              <h4 className={classes.price}>{rider.price}m</h4>
            </div>
        </div>
    </div>
  );
}



interface EmptyRiderVisualProps {
  category: RiderCategory;
  handleMapVisibility: () => void;
}

export function EmptyRiderVisual({category, handleMapVisibility}: EmptyRiderVisualProps){
  const {setFocusedCategory, setPage} = useFilterContext();

  const handleClick = () => {
    setFocusedCategory(category);
    setPage(1);
    setTimeout(() => handleMapVisibility(), 30);
  };

  return (
    <div className={classes.container} id={classes.emptyContainer} onClick={handleClick}>
        <IconSquareRoundedPlusFilled size={22} className={classes.plus} />
        <Image src='/neutral-kit2.webp' alt='Default kit' width={75} height={75} className={classes.kit}/>
        <div className={classes.infoContainer}>
            <div>
                <h4 className={classes.name}>-</h4>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-evenly', background: 'var(--light-grey)'}}>
              <h4 className={classes.price}>-</h4>
            </div>
        </div>
    </div>
  );
}