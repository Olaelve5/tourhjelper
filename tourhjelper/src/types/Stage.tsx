export type Stage = {
    stage: number;
    imageURL: string;
    date: string;
    start: string;
    distance: number;
    type: string;
    lastUpdated?: string;
    maxPoints?: number;
    favorites?: {
        first: Array<string>;
        second: Array<string>;
        third: Array<string>;
    }
};