import { useState, useEffect } from "react";
import StageDropdown from "./stage_dropdown";
import { supabase } from "@/utils/supabase";
import classes from "@/styles/Admin/dashboard.module.css";
import PickedFavorites from "./picked_favorites";
import RiderModal from "./rider_selector_modal";
import UpdateButtons from "./update_buttons";
import NavigationButton from "./navigation_button";
import { StageFavorites } from "../../types/StageFavorites";

const AdminDashboard = () => {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [favorites, setFavorites] = useState<StageFavorites | null>(null);
  const [localFavorites, setLocalFavorites] = useState<StageFavorites | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStageData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", selectedStage)
        .single();

      if (!error && data) {
        setFavorites(data);
        setLocalFavorites(data);
      }
      setLoading(false);
    };

    fetchStageData();
  }, [selectedStage]);

  return (
    <div className={classes.container}>
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
        {loading ? (
          <p>Laster data...</p>
        ) : favorites ? (
          <PickedFavorites
            stars_3={localFavorites?.stars_3 || []}
            stars_2={localFavorites?.stars_2 || []}
            stars_1={localFavorites?.stars_1 || []}
            setLocalFavorites={setLocalFavorites}
          />
        ) : (
          <p>Ingen data funnet for etappe {selectedStage}</p>
        )}
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
