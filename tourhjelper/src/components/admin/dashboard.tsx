import { useState, useEffect, useRef } from "react";
import StageDropdown from "./stage_dropdown";
import { supabase } from "@/utils/supabase";
import classes from "@/styles/Admin/dashboard.module.css";
import PickedFavorites from "./picked_favorites";
import RiderModal from "./rider_selector_modal";
import UpdateButtons from "./update_buttons";
import NavigationButton from "./navigation_button";
import { StageFavorites } from "../../types/StageFavorites";
import { useSwipe } from "@/utils/swipeUtils";

const AdminDashboard = () => {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [favorites, setFavorites] = useState<StageFavorites | null>(null);
  const [localFavorites, setLocalFavorites] = useState<StageFavorites | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  // Swipe handling
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      if (selectedStage < 21) {
        setSelectedStage(selectedStage + 1);
      }
    } else if (direction === "right") {
      if (selectedStage > 1) {
        setSelectedStage(selectedStage - 1);
      }
    }
  };

  useSwipe({
    ref: containerRef,
    onSwipe,
    touchStartX,
    touchStartY,
    setTouchStartX,
    setTouchStartY,
  });

  useEffect(() => {
    const fetchStageData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", selectedStage)
        .maybeSingle();

      if (!error && data) {
        setFavorites(data);
        setLocalFavorites(data);
      } else {
        setFavorites(null);
        setLocalFavorites(null);
      }
      setLoading(false);
    };

    fetchStageData();
  }, [selectedStage]);

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.header}>
        <h1 className={classes.title}>Admin Dashboard</h1>
        <NavigationButton url_to_admin={false} label="Gå til hovedside" />
      </div>
      <div className={classes.controls}>
        <StageDropdown
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
        />
        <RiderModal
          setLocalStageFavorites={setLocalFavorites}
          localFavorites={localFavorites}
        />
      </div>
      <div className={classes.favoritesSection}>
        <PickedFavorites
          stars_3={localFavorites?.stars_3 || []}
          stars_2={localFavorites?.stars_2 || []}
          stars_1={localFavorites?.stars_1 || []}
          setLocalFavorites={setLocalFavorites}
        />
      </div>
      <UpdateButtons
        setLocalStageFavorites={setLocalFavorites}
        favorites={favorites}
        localFavorites={localFavorites}
        selectedStage={selectedStage}
        setFavorites={setFavorites}
      />
    </div>
  );
};

export default AdminDashboard;
