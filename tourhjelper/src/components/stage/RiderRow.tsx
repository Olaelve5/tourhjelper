import React from "react";
import classes from "@/styles/Stage/Favorites.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { useRiderContext } from "@/providers/RiderProvider";
import { Rider } from "@/types/Rider";
import { getShortenedName } from "@/utils/riderUtils";

const RiderRow = ({ rider }: { rider: Rider | null }) => {
  const { riderImages } = useRiderContext();

  const imageUrl = rider?.image_url || "neutral-kit.webp";

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
          <p style={{ fontSize: "0.7em", color: "#a4b6c7" }}>{rider.team}</p>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: "0.9em", fontWeight: "bold" }}>{rider.price}m</p>
        <p style={{ fontSize: "0.7em", color: "#a4b6c7" }}>{rider.category}</p>
      </div>
    </div>
  );
};

export default RiderRow;
