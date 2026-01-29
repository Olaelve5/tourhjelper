import { useState, useEffect } from "react";
import StageDropdown from "./stage_dropdown";
import { supabase } from "@/utils/supabase";
import classes from "@/styles/Admin/dashboard.module.css";

interface StageFavorites {
  id: number;
  stage_number: number;
  stars_3: string[];
  stars_2: string[];
  stars_1: string[];
  comment: string;
}

const AdminDashboard = () => {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [favorites, setFavorites] = useState<StageFavorites | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple caching
  const [cache, setCache] = useState<Record<number, StageFavorites>>({});

  useEffect(() => {
    const fetchStageData = async () => {
      if (cache[selectedStage]) {
        setFavorites(cache[selectedStage]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", selectedStage)
        .single();

      if (!error && data) {
        setFavorites(data);
        setCache((prev) => ({ ...prev, [selectedStage]: data }));
      }
      setLoading(false);
    };

    fetchStageData();
  }, [selectedStage]);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Admin Dashboard</h1>
      <StageDropdown
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
      />

      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Laster data...</p>
        ) : favorites ? (
          <pre>{JSON.stringify(favorites, null, 2)}</pre>
        ) : (
          <p>Ingen data funnet for etappe {selectedStage}</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
