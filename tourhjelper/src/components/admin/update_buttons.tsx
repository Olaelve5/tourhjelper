import { useState } from "react";
import { IconPencilCheck, IconRefresh } from "@tabler/icons-react";
import { useMantineTheme, Button } from "@mantine/core";
import { Stage } from "../../types/Stage";
import { supabase } from "@/utils/supabase";
import classes from "@/styles/Admin/modal.module.css";

interface UpdateButtonsProps {
  setLocalStageFavorites: React.Dispatch<React.SetStateAction<Stage | null>>;
  favorites: Stage | null;
  localFavorites: Stage | null;
  selectedStage: number;
  setFavorites: React.Dispatch<React.SetStateAction<Stage | null>>;
}

const UpdateButtons = ({
  setLocalStageFavorites,
  favorites,
  localFavorites,
  selectedStage,
  setFavorites,
}: UpdateButtonsProps) => {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const isUnchanged =
    JSON.stringify(favorites) === JSON.stringify(localFavorites);
  const isDisabled = loading || isUnchanged;

  const handleReset = () => {
    setLocalStageFavorites(favorites || null);
  };

  const handleSave = async () => {
    if (!localFavorites) return;

    setLoading(true);

    // 1. Prepare the payload
    // We only send the fields we actually want to update in the DB.
    // This prevents accidental overwrites of static data if localFavorites is incomplete.
    const updates = {
      stars_3: localFavorites.stars_3,
      stars_2: localFavorites.stars_2,
      stars_1: localFavorites.stars_1,
      comment: localFavorites.comment,
      updated_at: new Date().toISOString(),
    };

    try {
      // 2. Update the 'stages' table
      const { data, error } = await supabase
        .from("stages")
        .update(updates)
        .eq("stage_number", selectedStage)
        .select()
        .single();

      if (error) {
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
        throw error;
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      // 3. Update local state with the returned (confirmed) data
      if (data) {
        setFavorites(data as Stage);
        // Also update localFavorites to match the new "clean" state
        setLocalStageFavorites(data as Stage);
      }
    } catch (error) {
      console.error("Error saving favorites:", error);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3rem",
        marginBottom: "4rem",
      }}>
      <div className={classes.buttonGroup}>
        <Button
          bg={theme.colors.pink[8]}
          radius={"md"}
          leftSection={<IconRefresh />}
          onClick={handleReset}
          disabled={isDisabled}
          className={classes.updateButton}>
          Reset
        </Button>
        <Button
          bg={theme.colors.teal[8]}
          radius={"md"}
          leftSection={<IconPencilCheck />}
          onClick={handleSave}
          loading={loading}
          disabled={isDisabled}
          className={classes.updateButton}>
          Lagre
        </Button>
      </div>
      {showSuccess && (
        <p style={{ color: theme.colors.teal[8], marginTop: "1rem" }}>
          Endringer lagret!
        </p>
      )}
      {showError && (
        <p style={{ color: theme.colors.pink[8], marginTop: "1rem" }}>
          Feil ved lagring av endringer.
        </p>
      )}
    </div>
  );
};

export default UpdateButtons;
