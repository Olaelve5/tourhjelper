import React from "react";
import classes from "@/styles/Stage/Favorites.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { Loader } from "@mantine/core";
import { useRiderContext } from "@/providers/RiderProvider";
import { Rider } from "@/types/Rider";
import { getShortenedName } from "@/utils/riderUtils";
import { useStageFavorites } from "@/hooks/useStageFavorites";

export function Favorites({ stageNumber }: { stageNumber: number }) {
  const { getRiderById } = useRiderContext();

  const {
    data: favorites,
    isLoading,
    isPlaceholderData,
  } = useStageFavorites(stageNumber);

  function formatUpdatedAt(value: string | undefined | null) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;

    return new Intl.DateTimeFormat("nb-NO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  }

  // Only show main loader on the VERY first load of the app
  // When switching stages, 'isLoading' will be false because we have 'previousData'
  if (isLoading) {
    return (
      <div
        className={classes.container}
        style={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20rem",
        }}>
        <Loader />
      </div>
    );
  }

  if (!favorites) {
    return (
      <p style={{ fontStyle: "italic", minHeight: "20rem" }}>
        Ingen favoritter valgt for denne etappen.
      </p>
    );
  }

  const riders3 = favorites.stars_3.map(
    (id: number) => getRiderById(id) ?? null,
  );
  const riders2 = favorites.stars_2.map(
    (id: number) => getRiderById(id) ?? null,
  );
  const riders1 = favorites.stars_1.map(
    (id: number) => getRiderById(id) ?? null,
  );

  return (
    <div
      className={classes.container}
      // OPTIONAL: Dim the content slightly while fetching the new stage
      style={{
        opacity: isPlaceholderData ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}>
      {/* 3-Star Section */}
      <div>
        <div
          style={{ justifyContent: "space-between" }}
          className={classes.starContainer}>
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <IconStarFilled size={20} className={classes.star} />
            <IconStarFilled size={20} className={classes.star} />
            <IconStarFilled size={20} className={classes.star} />
          </div>
          <p style={{ fontSize: "0.8em", opacity: 0.5, margin: 0 }}>
            Oppdatert: {formatUpdatedAt(favorites.updated_at)}
          </p>
        </div>
        {riders3.length > 0 ? (
          riders3.map((rider: Rider | null, index: number) => (
            <RiderRow key={index} rider={rider} />
          ))
        ) : (
          <p>Ingen 3-stjerners favoritter valgt.</p>
        )}
      </div>

      {/* 2-Star Section */}
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
          <IconStarFilled size={20} className={classes.star} />
        </div>
        {riders2.length > 0 ? (
          riders2.map((rider: Rider | null, index: number) => (
            <RiderRow key={index} rider={rider} />
          ))
        ) : (
          <p>Ingen 2-stjerners favoritter valgt.</p>
        )}
      </div>

      {/* 1-Star Section */}
      <div>
        <div className={classes.starContainer}>
          <IconStarFilled size={20} className={classes.star} />
        </div>
        {riders1.length > 0 ? (
          riders1.map((rider: Rider | null, index: number) => (
            <RiderRow key={index} rider={rider} />
          ))
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
