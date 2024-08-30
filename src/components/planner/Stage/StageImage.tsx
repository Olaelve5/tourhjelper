import React, {useState} from 'react';

import { Container, Image, Overlay } from '@mantine/core';
import classes from '@/styles/Stage/StageImage.module.css';
import { IconArrowsDiagonal } from '@tabler/icons-react';

interface StageImageProps {
    imageURL: string;
}

export function StageImage({imageURL}: StageImageProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
    }

    if(isExpanded) {
        return (
            <div>
                <Overlay center blur={5} fixed onClick={handleClick}>
                    <Image
                    src={imageURL}
                    alt="Main Stage"
                    className={classes.expandedImage}
                    />
                </Overlay>
            </div>
        )
    }

    return (
        <div className={classes.imageContainer} onClick={handleClick}>
            <Image
            src={imageURL}
            alt="Main Stage"
            className={classes.image}
            />
            <div className={classes.expandIconContainer}>
                <IconArrowsDiagonal size={25} className={classes.expandIcon}/>
            </div>
        </div>
    );
}