import { Rider } from "@/types/Rider";
import { doc, setDoc, collection, getDocs, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; 

export async function fetchRiderData() {
    try {
        const ridersRef = collection(db, "riders");
        const ridersSnapshot = await getDocs(ridersRef);
        const riders = ridersSnapshot.docs.map(doc => doc.data() as Rider);
        return riders;
    } catch (e) {
        console.error("Error fetching rider data: ", e);
        throw e;
    }
}

export async function fetchRiderImages() {
    try {
        const riderImagesRef = collection(db, "rider_images");
        const riderImagesSnapshot = await getDocs(riderImagesRef);
        const riderImages = riderImagesSnapshot.docs.map(doc => doc.data() as { team: string; image: string });
        return riderImages;
    } catch (e) {
        console.error("Error fetching rider images: ", e);
        throw e;
    }
}