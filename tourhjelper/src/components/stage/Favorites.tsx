import React from "react";
import classes from "@/styles/Stage/Favorites.module.css";
import { IconStarFilled } from "@tabler/icons-react";
import { useRiderContext } from "@/providers/RiderProvider";
import { Rider } from "@/types/Rider";
import { getShortenedName } from "@/utils/riderUtils";
import { Stage } from "@/types/Stage";

export function Favorites({ stageData }: { stageData: Stage }) {
  const { getRiderById } = useRiderContext();

  function formatUpdatedAt(value: string | undefined | null) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;

    return new Intl.DateTimeFormat("nb-NO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  }

  // Helper to map IDs to Rider objects safely
  const getRiders = (ids: number[] | null | undefined) =>
    (ids || []).map((id) => getRiderById(id) ?? null);

  const riders3 = getRiders(stageData.stars_3);
  const riders2 = getRiders(stageData.stars_2);
  const riders1 = getRiders(stageData.stars_1);

  const hasFavorites =
    riders3.length > 0 || riders2.length > 0 || riders1.length > 0;

  if (!hasFavorites) {
    return (
      <p style={{ fontStyle: "italic", minHeight: "20rem", padding: "1rem" }}>
        Ingen favoritter valgt for denne etappen.
      </p>
    );
  }

  return (
    <div className={classes.container}>
      <StarSection
        count={3}
        riders={riders3}
        rightContent={
          <p style={{ fontSize: "0.8em", color: "#a4b6c7", margin: 0 }}>
            Oppdatert: {formatUpdatedAt(stageData.updated_at)}
          </p>
        }
      />
      <StarSection count={2} riders={riders2} />
      <StarSection count={1} riders={riders1} />
    </div>
  );
}

// --- Sub-Components ---

interface StarSectionProps {
  count: number;
  riders: (Rider | null)[];
  rightContent?: React.ReactNode;
}

const StarSection = ({ count, riders, rightContent }: StarSectionProps) => {
  return (
    <div>
      <div
        className={classes.starContainer}
        style={rightContent ? { justifyContent: "space-between" } : undefined}>
        {/* Render stars dynamically */}
        <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
          {[...Array(count)].map((_, i) => (
            <IconStarFilled key={i} size={20} className={classes.star} />
          ))}
        </div>
        {rightContent}
      </div>

      {riders.length > 0 ? (
        riders.map((rider, index) => <RiderRow key={index} rider={rider} />)
      ) : (
        <p>Ingen {count}-stjerners favoritter valgt.</p>
      )}
    </div>
  );
};

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
