import { RiderVisual, EmptyRiderVisual } from "@/components/planner/Map/RiderVisual";
import { Rider, RiderCategory } from "@/types/Rider";

const scheme = {
    Kaptein: 2,
    Spurter: 2,
    Klatrer: 2,
    Ungdomsrytter: 2,
    Hjelperytter: 3,
    Temporytter: 1,
    Sportsdirektør: 1
}

export const validateUpdate = (riders: Rider[], newRider: Rider) => {
    const activeRiders = riders.filter(r => !r.undefined);
    if(activeRiders.some(r => r.name === newRider.name && r.team === newRider.team && r.price === newRider.price)) return false;
    const riderCategory = newRider.category;
    const riderCount = activeRiders.filter(r => r.category === riderCategory).length;
    return riderCount < scheme[riderCategory];
}

export const getRiderVisuals = (riders: Rider[], category: RiderCategory, handleMapVisibility: () => void) => {
    let categoryRiders = riders.filter(r => r.category === category);
    let visuals = [];

    for (let i = 0; i < scheme[category]; i++) {
        if(categoryRiders[i] === undefined || categoryRiders[i].undefined) {
            visuals.push(<EmptyRiderVisual category={category} handleMapVisibility={handleMapVisibility} key={category + '-' + i}/>);
            continue;
        }
        const rider: Rider = categoryRiders[i];
        visuals.push(<RiderVisual key={categoryRiders[i].name} rider={rider}/>);
    }
    return (
        <>
            {visuals.map(visual => visual)}
        </>
    )
};

export const calculateTransferDifference = (oldRiders: Rider[], newRiders: Rider[]) => {
    let difference = 0;
    for (let i = 0; i < 13; i++) {
        if(oldRiders[i] === undefined || newRiders[i] === undefined) {
            continue;
        }

        if(oldRiders.some(r => r.name === newRiders[i].name && r.team === newRiders[i].team && r.price === newRiders[i].price)) {            
            continue;
        }

        if(newRiders[i].undefined) {
            difference--;
        }

        difference++;
    }
    return difference;
};