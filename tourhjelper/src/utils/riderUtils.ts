import { Rider } from "@/types/Rider";

// Return riders from a JSON file in public folder
export async function getRiders() {
  const response = await fetch("/data/rider_data.json");
  const riders = await response.json();
  return riders as Rider[];
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
    (rider) => rider.name.toLowerCase() === name.toLowerCase()
  );
}

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
    ] || "Ukjent kategori"
  );
}
