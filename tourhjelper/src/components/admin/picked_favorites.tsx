import { IconStarFilled, IconSquareMinusFilled } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import classes from "@/styles/Admin/picked_favorites.module.css";
import { Stage } from "@/types/Stage";
import { useMantineTheme } from "@mantine/core";
import { useRiderContext } from "@/providers/RiderProvider";

interface FavoritesSectionProps {
  numberOfFavorites: number;
  favorites: number[];
  setLocalFavorites: Dispatch<SetStateAction<Stage | null>>;
}

const FavoritesSection = ({
  numberOfFavorites,
  favorites,
  setLocalFavorites,
}: FavoritesSectionProps) => {
  const theme = useMantineTheme();
  const { getRiderById } = useRiderContext();

  const handleMinusClick = (riderToRemove: number) => {
    const updatedFavorites = favorites.filter(
      (rider) => rider !== riderToRemove,
    );

    setLocalFavorites((prev: Stage | null) => {
      if (!prev) return prev;

      // Logic remains the same since 'Stage' has these properties at the root level
      if (numberOfFavorites === 3) {
        return { ...prev, stars_3: updatedFavorites };
      } else if (numberOfFavorites === 2) {
        return { ...prev, stars_2: updatedFavorites };
      } else {
        return { ...prev, stars_1: updatedFavorites };
      }
    });
  };

  const riderObjects = favorites.map((riderId) => getRiderById(riderId));

  return (
    <div>
      <h3 className={classes.stars}>
        {Array.from({ length: numberOfFavorites }).map((_, i) => (
          <IconStarFilled key={i} size={18} color="var(--yellow-tdf)" />
        ))}
      </h3>

      {favorites.length === 0 ? (
        <p style={{ opacity: 0.5 }}>Ingen ryttere valgt.</p>
      ) : null}

      <ul>
        {favorites.map((rider, index) => (
          <li key={index} className={classes.riderRow}>
            <div>
              <p>{riderObjects[index]?.name}</p>
              <p style={{ opacity: 0.5, fontSize: "0.8em" }}>
                {riderObjects[index]?.team}
              </p>
            </div>
            <IconSquareMinusFilled
              size={24}
              color={theme.colors.red[7]}
              onClick={() => handleMinusClick(favorites[index])}
              style={{
                cursor: "pointer",
              }}
              className={classes.removeButton}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

interface PickedFavoritesProps {
  stars_3: number[];
  stars_2: number[];
  stars_1: number[];
  setLocalFavorites: Dispatch<SetStateAction<Stage | null>>;
}

const PickedFavorites = ({
  stars_3,
  stars_2,
  stars_1,
  setLocalFavorites,
}: PickedFavoritesProps) => {
  return (
    <div className={classes.container}>
      <FavoritesSection
        numberOfFavorites={3}
        favorites={stars_3}
        setLocalFavorites={setLocalFavorites}
      />
      <FavoritesSection
        numberOfFavorites={2}
        favorites={stars_2}
        setLocalFavorites={setLocalFavorites}
      />
      <FavoritesSection
        numberOfFavorites={1}
        favorites={stars_1}
        setLocalFavorites={setLocalFavorites}
      />
    </div>
  );
};

export default PickedFavorites;
