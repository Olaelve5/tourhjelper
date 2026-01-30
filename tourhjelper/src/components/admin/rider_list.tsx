import { StageFavorites } from "./types/StageFavorites";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Button } from "@mantine/core";
import classes from "@/styles/Admin/rider_list.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase";

// Define the shape of the data coming from Supabase
interface RiderData {
  id: number;
  name: string;
  team: string;
  category: string;
  price: number;
}

interface RiderListProps {
  stageFavorites?: StageFavorites | null;
  setStageFavorites: Dispatch<SetStateAction<StageFavorites | null>>;
  searchTerm?: string;
}

interface RiderRowProps {
  rider: RiderData;
  setStageFavorites: Dispatch<SetStateAction<StageFavorites | null>>;
  favorite_3?: boolean;
  favorite_2?: boolean;
  favorite_1?: boolean;
}

const RiderRow = ({
  rider,
  favorite_3,
  favorite_2,
  favorite_1,
  setStageFavorites,
}: RiderRowProps) => {
  const handleClick = (starCount: number) => {
    setStageFavorites((prev) => {
      if (!prev) return null;

      const riderId = rider.name;
      const targetKey = `stars_${starCount}` as keyof Pick<
        StageFavorites,
        "stars_1" | "stars_2" | "stars_3"
      >;
      const currentList = prev[targetKey] || [];
      const isTogglingOff = currentList.includes(riderId);

      // Remove from ALL lists first (Clean State)
      const cleanState = {
        ...prev,
        stars_1: (prev.stars_1 || []).filter((id) => id !== riderId),
        stars_2: (prev.stars_2 || []).filter((id) => id !== riderId),
        stars_3: (prev.stars_3 || []).filter((id) => id !== riderId),
      };

      // If we are NOT toggling off, add to the target
      if (!isTogglingOff) {
        cleanState[targetKey] = [...cleanState[targetKey], riderId];
      }

      return cleanState;
    });
  };

  return (
    <div className={classes.riderRow}>
      <div>
        <p>{rider.name}</p>
        <p style={{ fontSize: "12px", opacity: 0.5 }}>{rider.team}</p>
      </div>

      <div className={classes.buttons}>
        <Button
          size="xs"
          radius={"sm"}
          p={"0 10px"}
          variant={"filled"}
          onClick={() => handleClick(3)}
          color={favorite_3 ? "var(--header-color)" : "var(--highlight-grey)"}>
          3
          <IconStarFilled size={12} style={{ marginLeft: 4 }} />
        </Button>
        <Button
          size="xs"
          radius={"sm"}
          p={"0 10px"}
          variant={"filled"}
          onClick={() => handleClick(2)}
          color={favorite_2 ? "var(--header-color)" : "var(--highlight-grey)"}>
          2
          <IconStarFilled size={12} style={{ marginLeft: 4 }} />
        </Button>
        <Button
          size="xs"
          radius={"sm"}
          p={"0 10px"}
          variant={"filled"}
          onClick={() => handleClick(1)}
          color={"black"}
          bg={favorite_1 ? "var(--header-color)" : "var(--highlight-grey)"}>
          1
          <IconStarFilled size={12} style={{ marginLeft: 4 }} />
        </Button>
      </div>
    </div>
  );
};

const RiderList = ({
  stageFavorites,
  setStageFavorites,
  searchTerm,
}: RiderListProps) => {
  const [allRiders, setAllRiders] = useState<RiderData[]>([]);
  const [displayRiders, setDisplayRiders] = useState<RiderData[]>([]);

  // 1. Fetch Riders from Supabase
  useEffect(() => {
    const fetchRiders = async () => {
      const { data, error } = await supabase
        .from("riders")
        .select("*")
        .neq("category", "Sportsdirektør") // Filter out directors
        .order("price", { ascending: false });

      if (error) {
        console.error("Error fetching riders:", error);
      } else if (data) {
        setAllRiders(data);
        setDisplayRiders(data);
      }
    };

    fetchRiders();
  }, []);

  // 2. Handle Search Filtering
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = allRiders.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerTerm) ||
          item.team.toLowerCase().includes(lowerTerm),
      );
      setDisplayRiders(filtered);
    } else {
      setDisplayRiders(allRiders);
    }
  }, [searchTerm, allRiders]);

  return (
    <div className={classes.container}>
      {displayRiders.map((item) => {
        const isFav3 = stageFavorites?.stars_3?.includes(item.name);
        const isFav2 = stageFavorites?.stars_2?.includes(item.name);
        const isFav1 = stageFavorites?.stars_1?.includes(item.name);

        return (
          <RiderRow
            key={item.id}
            rider={item}
            favorite_3={isFav3}
            favorite_2={isFav2}
            favorite_1={isFav1}
            setStageFavorites={setStageFavorites}
          />
        );
      })}
    </div>
  );
};

export default RiderList;
