import { StageFavorites } from "../../types/StageFavorites";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Button, Divider, Text } from "@mantine/core";
import classes from "@/styles/Admin/rider_list.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase";

// --- CONFIGURATION: EDIT THIS LIST TO CHANGE ORDER ---
const CATEGORY_ORDER = [
  "Kaptein",
  "Spurter",
  "Klatrer",
  "Temporytter",
  "Hjelperytter",
  "Ungdomsrytter",
];

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
      // If nothing has been loaded yet, start from an empty state
      const base: StageFavorites =
        prev ??
        ({
          id: 0,
          stage_number: 0,
          comment: "",
          stars_1: [] as number[],
          stars_2: [] as number[],
          stars_3: [] as number[],
        } satisfies StageFavorites);

      const riderId = rider.id;
      const targetKey = `stars_${starCount}` as
        | "stars_1"
        | "stars_2"
        | "stars_3";

      const currentList = base[targetKey] ?? [];
      const isTogglingOff = currentList.includes(riderId);

      const next: StageFavorites = {
        ...base,
        stars_1: (base.stars_1 ?? []).filter((id) => id !== riderId),
        stars_2: (base.stars_2 ?? []).filter((id) => id !== riderId),
        stars_3: (base.stars_3 ?? []).filter((id) => id !== riderId),
      };

      if (!isTogglingOff) {
        (next[targetKey] as number[]) = [...(next[targetKey] ?? []), riderId];
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
        .neq("category", "Sportsdirektør")
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
