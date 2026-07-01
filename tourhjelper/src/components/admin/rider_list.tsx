import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Button, Divider, Text } from "@mantine/core";
import classes from "@/styles/Admin/rider_list.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase";
import { Stage } from "@/types/Stage"; // 1. Change Import

// --- CONFIGURATION: EDIT THIS LIST TO CHANGE ORDER ---
const CATEGORY_ORDER = [
  "Kaptein",
  "Spurter",
  "Klatrer",
  "Tempo",
  "Hjelperytter",
  "Ungdomsrytter",
  "Sportsdirektør",
];

interface RiderData {
  id: number;
  name: string;
  team: string;
  category: string;
  price: number;
}

interface RiderListProps {
  // 2. Update Type
  stageFavorites?: Stage | null;
  setStageFavorites: Dispatch<SetStateAction<Stage | null>>;
  searchTerm?: string;
}

interface RiderRowProps {
  rider: RiderData;
  // 3. Update Type
  setStageFavorites: Dispatch<SetStateAction<Stage | null>>;
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
      // Safety Check: If data hasn't loaded yet, don't try to edit.
      if (!prev) return prev;

      const riderId = rider.id;
      const targetKey = `stars_${starCount}` as
        | "stars_1"
        | "stars_2"
        | "stars_3";

      // Check if we are toggling off (clicking 3 stars when it is already 3 stars)
      const currentList = prev[targetKey] ?? [];
      const isTogglingOff = currentList.includes(riderId);

      // Create the new state by cleaning the rider from ALL lists first
      // (This ensures a rider can't be both 2-star and 3-star)
      const next: Stage = {
        ...prev,
        stars_1: (prev.stars_1 ?? []).filter((id) => id !== riderId),
        stars_2: (prev.stars_2 ?? []).filter((id) => id !== riderId),
        stars_3: (prev.stars_3 ?? []).filter((id) => id !== riderId),
      };

      // If we are NOT toggling off, add the rider to the target list
      if (!isTogglingOff) {
        next[targetKey] = [...(next[targetKey] ?? []), riderId];
      }

      return next;
    });
  };

  return (
    <div className={classes.riderRow}>
      <div>
        <p>{rider.name}</p>
        <p className={classes.team}>{rider.team}</p>
      </div>

      <div className={classes.buttons}>
        <Button
          size="xs"
          radius={"sm"}
          p={"0 10px"}
          variant={"filled"}
          onClick={() => handleClick(3)}
          color={favorite_3 ? "var(--header-color)" : "var(--highlight-grey)"}
          style={{ border: favorite_3 ? "none" : "1px solid #374b61" }}>
          3
          <IconStarFilled size={12} style={{ marginLeft: 4 }} />
        </Button>
        <Button
          size="xs"
          radius={"sm"}
          p={"0 10px"}
          variant={"filled"}
          onClick={() => handleClick(2)}
          color={favorite_2 ? "var(--header-color)" : "var(--highlight-grey)"}
          style={{ border: favorite_2 ? "none" : "1px solid #374b61" }}>
          2
          <IconStarFilled size={12} style={{ marginLeft: 4 }} />
        </Button>
        <Button
          size="xs"
          radius={"sm"}
          p={"0 10px"}
          variant={"filled"}
          onClick={() => handleClick(1)}
          style={{ border: favorite_1 ? "none" : "1px solid #374b61" }}
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

  useEffect(() => {
    const fetchRiders = async () => {
      const { data, error } = await supabase
        .from("riders")
        .select("*")
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

  const categories = Array.from(
    new Set(displayRiders.map((r) => r.category)),
  ).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.localeCompare(b);
  });

  return (
    <div className={classes.container}>
      {categories.map((category) => (
        <div key={category}>
          <Divider
            my="sm"
            labelPosition="center"
            label={
              <Text c="dimmed" size="xs" fw={700} tt="uppercase">
                {category}
              </Text>
            }
          />

          {displayRiders
            .filter((rider) => rider.category === category)
            .map((item) => {
              // 4. Update Optional Chaining: Ensure we handle undefined arrays safely
              const isFav3 = stageFavorites?.stars_3?.includes(item.id);
              const isFav2 = stageFavorites?.stars_2?.includes(item.id);
              const isFav1 = stageFavorites?.stars_1?.includes(item.id);

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
      ))}

      {displayRiders.length === 0 && (
        <Text c="dimmed" size="sm" ta="center" mt="xl">
          Ingen ryttere funnet
        </Text>
      )}
    </div>
  );
};

export default RiderList;
