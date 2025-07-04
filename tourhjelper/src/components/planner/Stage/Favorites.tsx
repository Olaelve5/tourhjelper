import React, { useState, useEffect } from "react";
import classes from "@/styles/Stage/Favorites.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { useStageContext } from "@/providers/StageProvider";

interface StageFavorites {
  stage: number;
  "3_stars": string[];
  "2_stars": string[];
  "1_stars": string[];
}

export function Favorites() {
  const { activeStage } = useStageContext();
  const [favorites, setFavorites] = useState<StageFavorites | null>(null);

  useEffect(() => {
    const getStageFavorites = async () => {
      try {
        const response = await fetch("/data/stage_favorites.json");
        const data = await response.json();

        if (activeStage) {
          const stage = data.find(
            (stageData: StageFavorites) => stageData.stage === activeStage
          );
          setFavorites(stage || null);
        }
      } catch (error) {
        console.error("Error fetching stage favorites:", error);
      }
    };

    getStageFavorites();
  }, [activeStage]);

  if (!favorites) {
    return <div>Loading favorites...</div>;
  }

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
        </div>
        <p>{favorites["3_stars"].join(", ")}</p>
      </div>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
        </div>
        <p>{favorites["2_stars"].join(", ")}</p>
      </div>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
        </div>
        <p>{favorites["1_stars"].join(", ")}</p>
      </div>
    </div>
  );
}
