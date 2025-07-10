// Define a type for the categories
export type RiderCategory =
  | "Kaptein"
  | "Spurter"
  | "Klatrer"
  | "Ungdomsrytter"
  | "Hjelperytter"
  | "Temporytter"
  | "Sportsdirektør";

// Define a type for the rider objects
export type Rider = {
  name: string;
  category: RiderCategory;
  team: string;
  price: number;
  points?: number;
  undefined?: boolean;
};

