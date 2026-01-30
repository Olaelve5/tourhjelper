import { IconStarFilled, IconSquareMinusFilled } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import classes from "@/styles/Admin/picked_favorites.module.css";
import { StageFavorites } from "./types/StageFavorites";

interface FavoritesSectionProps {
  numberOfFavorites: number;
  favorites: string[];
  setLocalFavorites: Dispatch<SetStateAction<StageFavorites | null>>;
}

const FavoritesSection = ({
  numberOfFavorites,
  favorites,
  setLocalFavorites,
}: FavoritesSectionProps) => {
  const handleMinusClick = (riderToRemove: string) => {
    const updatedFavorites = favorites.filter(
      (rider) => rider !== riderToRemove,
    );

    setLocalFavorites((prev: StageFavorites | null) => {
      if (!prev) return prev;

      if (numberOfFavorites === 3) {
        return { ...prev, stars_3: updatedFavorites };
      } else if (numberOfFavorites === 2) {
        return { ...prev, stars_2: updatedFavorites };
      } else {
        return { ...prev, stars_1: updatedFavorites };
      }
    });
  };

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
            <p>{rider}</p>
            <IconSquareMinusFilled
              size={24}
              color="red"
              onClick={() => handleMinusClick(rider)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

interface PickedFavoritesProps {
  stars_3: string[];
  stars_2: string[];
  stars_1: string[];
  setLocalFavorites: Dispatch<SetStateAction<StageFavorites | null>>;
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
