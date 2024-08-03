export type Stage = {
    id: number;
    imageURL: string;
    date: string;
    time: string;
    length: number;
    type: string;
    maxPoints: number;
    favorites: {
        first: Array<string>;
        second: Array<string>;
        third: Array<string>;
    }
};