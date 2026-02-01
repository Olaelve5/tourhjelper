import React, { useState, useEffect } from "react";
import classes from "@/styles/Stage/Favorites.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { StageFavorites } from "@/types/StageFavorites";
import { supabase } from "@/utils/supabase";
import { Loader } from "@mantine/core";
import { useRiderContext } from "@/providers/RiderProvider";
import { Rider } from "@/types/Rider";
import { getShortenedName } from "@/utils/riderUtils";

export function Favorites({ stageNumber }: { stageNumber: number }) {
  const { getRiderById } = useRiderContext();
  const [favorites, setFavorites] = useState<StageFavorites | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const fetchStageData = async () => {
      setIsFetching(true);

      timer = setTimeout(() => {
        if (isMounted) setShowLoader(true);
      }, 800);

      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", stageNumber)
        .maybeSingle();

      clearTimeout(timer);

      if (isMounted) {
        setShowLoader(false);
        setIsFetching(false);

        if (!error && data) {
          setFavorites(data);
          setUpdatedAt(data.updated_at);
        }

        if (!data) {
          setFavorites(null);
          setUpdatedAt(null);
        }

        if (error) {
          setFavorites(null);
          console.error("Error fetching stage favorites: ", error);
        }
      }
    };

    fetchStageData();
  }, [stageNumber]);

  function formatUpdatedAt(value: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;

    return new Intl.DateTimeFormat("nb-NO", {
      dateStyle: "medium", // e.g. "1. feb. 2026"
      timeStyle: "short", // e.g. "14:05"
    }).format(d);
  }

  if (showLoader) {
    return <Loader />;
  }

  if (!favorites) {
    return <p>Ingen favoritter valgt for denne etappen.</p>;
  }

  const riders3 = favorites.stars_3.map((id) => getRiderById(id) ?? null);
  const riders2 = favorites.stars_2.map((id) => getRiderById(id) ?? null);
  const riders1 = favorites.stars_1.map((id) => getRiderById(id) ?? null);

  return (
    <div className={classes.container}>
      <div>
        <div
          style={{ justifyContent: "space-between" }}
          className={classes.starContainer}>
          <div
            style={{
              display: "flex",
              gap: "0.2rem",
              alignItems: "center",
            }}>
            <IconStarFilled size={20} className={classes.star} />
            <IconStarFilled size={20} className={classes.star} />
            <IconStarFilled size={20} className={classes.star} />
          </div>
          {isFetching ? (
            <Loader size="xs" />
          ) : (
            <p style={{ fontSize: "0.8em", opacity: 0.5, margin: 0 }}>
              Oppdatert: {formatUpdatedAt(updatedAt)}
            </p>
          )}
        </div>
        {riders3.length > 0 ? (
          riders3.map((rider, index) => <RiderRow key={index} rider={rider} />)
        ) : (
          <p>Ingen 3-stjerners favoritter valgt.</p>
        )}
      </div>
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
        </div>
        {riders2.length > 0 ? (
          riders2.map((rider, index) => <RiderRow key={index} rider={rider} />)
        ) : (
          <p>Ingen 2-stjerners favoritter valgt.</p>
        )}
      </div>

      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
        </div>
        {riders1.length > 0 ? (
          riders1.map((rider, index) => <RiderRow key={index} rider={rider} />)
        ) : (
          <p>Ingen 1-stjerners favoritter valgt.</p>
        )}
      </div>
    </div>
  );
}

const RiderRow = ({ rider }: { rider: Rider | null }) => {
  const { riderImages } = useRiderContext();

  const imageUrl =
    riderImages.find((img) => img.team === rider?.team)?.image ||
    "neutral-kit.webp";

  if (!rider) {
    return <p>Rytter ikke funnet</p>;
  }

  return (
    <div className={classes.riderRow}>
      <div style={{ display: "flex" }}>
        <img src={imageUrl} alt="rider" className={classes.riderImage} />
        <div>
          <p style={{ fontSize: "0.9em", fontWeight: "bold" }}>
            {getShortenedName(rider)}
          </p>
          <p style={{ fontSize: "0.7em", opacity: 0.5 }}>{rider.team}</p>
        </div>
      </div>
      <div>
        <p style={{ fontSize: "0.9em", fontWeight: "bold" }}>{rider.price}m</p>
        <p style={{ fontSize: "0.7em", opacity: 0.5 }}>{rider.category}</p>
      </div>
    </div>
  );
};
