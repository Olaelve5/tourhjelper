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
    const riderCategory = newRider.category;
    const riderCount = riders.filter(r => r.category === riderCategory).length;
    return riderCount < scheme[riderCategory];
}

export const getRiderVisuals = (riders: Rider[], category: RiderCategory) => {
    let categoryRiders = riders.filter(r => r.category === category);
    let visuals = [];

    for (let i = 0; i < scheme[category]; i++) {
        if(categoryRiders[i] === undefined) {
            visuals.push(<EmptyRiderVisual category={category} key={category + '-' + i}/>);
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

export const getAllRiders = () => {
    const riders: Rider[] = [
        {name: 'T. Pogacar', team: 'UAE Team Emirates', price: 11.8, category: 'Kaptein'},
        {name: 'R. Carapaz', team: 'EF Education - EasyPost', price: 9.7, category: 'Kaptein'},
        {name: 'B. Healy', team: 'EF Education - EasyPost', price: 6.5, category: 'Ungdomsrytter'},
        {name: 'S. Buitrago', team: 'Bahrain Victorious', price: 7.0, category: 'Ungdomsrytter'},
        {name: 'B. Girmay', team: 'Intermarché - Wanty', category: 'Spurter', price: 8.1 },
        {name: 'M. Van den Berg', team: 'EF Education - EasyPost', category: 'Spurter', price: 6.5 },
        {name: 'Team Visma | Lease a Bike', team: 'Team Visma | Lease a Bike', price: 10.6, category: 'Sportsdirektør'},
        {name: 'B. Armirail', team: 'Decathlon AG2R La Mondiale Team', price: 5.7, category: 'Temporytter'},
        {name: 'J. Hindley', team: 'Red Bull - BORA - hansgrohe', price: 8.1, category: 'Klatrer'},
        {name: 'D. Gee', team: 'Israel - Premier Tech', price: 7.5, category: 'Klatrer'},
        {name: 'J. Abrahamsen', team: 'Uno-X Mobility', price: 4.5, category: 'Hjelperytter'},
        {name: 'R. Gibbons', team: 'Lidl - Trek', price: 4.8, category: 'Hjelperytter'},
        {name: 'O. Lozkano', team: 'Movistar Team', price: 7.4, category: 'Hjelperytter'},
    ];
    return riders;
};

export const calculateTransferDifference = (oldRiders: Rider[], newRiders: Rider[]) => {
    let difference = 0;
    for (let i = 0; i < 13; i++) {
        if(oldRiders[i] === undefined || newRiders[i] === undefined) {
            continue;
        }

        if(oldRiders.some(r => r.name === newRiders[i].name && r.team === newRiders[i].team && r.price === newRiders[i].price)) {
            continue;
        }
        difference++;
    }
    return difference;
};