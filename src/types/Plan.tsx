import { PlanStage } from './PlanStage';

export type Plan = {
    id: string;
    name: string;
    stages: PlanStage[];
    color?: string;
}