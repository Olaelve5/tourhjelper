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
  id: number;
  name: string;
  category: RiderCategory;
  team: string;
  price: number;
  total_points?: number;
  undefined?: boolean;
};
