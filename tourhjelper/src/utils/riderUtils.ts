import { Rider } from "@/types/Rider";
import { supabase } from "./supabase";

// Return riders from a JSON file in public folder
export async function getRiders() {
  const { data, error } = await supabase.from("riders").select("*");

  if (error) {
    console.error("Error fetching riders: ", error);
    return [];
  }

  return data as Rider[];
}

// Return rider image links from a JSON file in public folder
export async function getRiderImages() {
  const response = await fetch("/data/rider_image_links.json");
  const images = await response.json();
  return images;
}

// Get a rider based on name
export async function getRiderByName(name: string): Promise<Rider | undefined> {
  const riders = await getRiders();
  return riders.find(
    (rider) => rider.name.toLowerCase() === name.toLowerCase(),
  );
}

export const getShortenedName = (rider: Rider) => {
    if (rider.category === "Sportsdirektør") return rider.name;
    const rider_names = rider.name.split(" ");
    if (rider_names.length > 1) {
      return rider_names[0].charAt(0) + ". " + rider_names.slice(1).join(" ");
    }

    return rider.name;
  };

const RiderCategoriesTranslation = {
  captain: "Kaptein",
  sprinter: "Spurter",
  climber: "Klatrer",
  youth: "Ungdomsrytter",
  support: "Hjelperytter",
  tempo: "Temporytter",
  manager: "Sportsdirektør",
};

export function translateRiderCategory(category: string) {
  return (
    RiderCategoriesTranslation[
      category as keyof typeof RiderCategoriesTranslation
    ] || category
  );
}
