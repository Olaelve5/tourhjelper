import React, { useState, useEffect } from "react";
import classes from "@/styles/Stage/Favorites.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { StageFavorites } from "@/types/StageFavorites";
import { supabase } from "@/utils/supabase";
import { Loader } from "@mantine/core";

export function Favorites({ stageNumber }: { stageNumber: number }) {
  const [favorites, setFavorites] = useState<StageFavorites | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStageData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", stageNumber)
        .maybeSingle();

      if (!error && data) {
        setFavorites(data);
      } else {
        setFavorites(null);
      }

      setLoading(false);
    };

    fetchStageData();
  }, [stageNumber]);

  if (loading) {
    return <Loader />;
  }

  if (!favorites) {
    return <p>Ingen favoritter valgt for denne etappen.</p>;
  }

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
        </div>
        <p>{favorites.stars_3.join(", ")}</p>
      </div>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
        </div>
        <p>{favorites.stars_2.join(", ")}</p>
      </div>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
        </div>
        <p>{favorites.stars_1.join(", ")}</p>
      </div>
    </div>
  );
}
