import {Rider} from './Rider';

export type PlanStage = {
    stage: number;
    team: Rider[];
    transfers: number;
};