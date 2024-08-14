import { Rider } from '@/types/Rider';


// Return riders from a JSON file in public folder
export async function getRiders() {
    const response = await fetch('/data/rider_data.json');
    const riders = await response.json();
    return riders as Rider[];
}

// Return rider image links from a JSON file in public folder
export async function getRiderImages() {
    const response = await fetch('/data/rider_image_links.json');
    const images = await response.json();
    return images;
}