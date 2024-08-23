import React, {useState, useEffect} from 'react';

import classes from '@/styles/PlanIndicator.module.css';
import { IconPlus } from '@tabler/icons-react';
import { Button, useMantineTheme } from '@mantine/core';
import { usePlanContext } from '@/providers/PlanProvider';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Plan } from '@/types/Plan';
import { CSS } from '@dnd-kit/utilities';

export function PlanIndicator() {
    const { plans, addPlan, setSelectedPlanId, setPlans} = usePlanContext();
    const [isDraggable, setIsDraggable] = useState<boolean>(false);

    const handleDragStart = ({active}: any) => {
        document.body.classList.add('grabbing');
        setSelectedPlanId(active.id);
    };

    const getPlanIndex = (id: string) => {
        return plans.findIndex(plan => plan.id === id);
    }

    const handleDragEnd = ({over, active}: any) => {
        document.body.classList.remove('grabbing');
        if(!over) return;
        if(active.id === over.id) return;

        const newPlans = arrayMove(plans, getPlanIndex(active.id), getPlanIndex(over.id));
        setPlans(newPlans);
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsDraggable(false);
            } else {
                setIsDraggable(true);
            }
        };

        handleResize(); // Set initial state based on current screen size
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
        >
            <div className={classes.container}>
                <SortableContext
                items={plans.map(plan => plan.id)}
                strategy={horizontalListSortingStrategy}
                >
                    {plans.map((plan, index) => (
                        <Tab key={plan.id} plan={plan} isDraggable={isDraggable}/>
                    ))}
                </SortableContext>
                <Button className={classes.plus} onClick={addPlan} display={plans.length < 3 ? 'block' : 'none'}>
                    <IconPlus size={22}/>
                </Button>
            </div>
        </DndContext>
    );
}


interface TabProps {
    plan: Plan;
    isDraggable: boolean;
}

function Tab({plan, isDraggable}: TabProps) {
    const {setSelectedPlanId, selectedPlanId} = usePlanContext();
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: plan.id, disabled: !isDraggable});

    const style = {
        transition,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
    }

    return (
        <Button
        className={selectedPlanId === plan.id ? classes.selected : classes.floater}
        onClick={() => setSelectedPlanId(plan.id)}
        ref={setNodeRef}
        {...(isDraggable ? attributes : {})}
        {...(isDraggable ? listeners : {})}
        style={style}
        size='xs'
        >
            <p>{plan.name}</p>
        </Button>
    );
}