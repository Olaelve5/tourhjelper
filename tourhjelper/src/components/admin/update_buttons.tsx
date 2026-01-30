import { useState } from "react";
import { IconPencilCheck, IconRefresh } from "@tabler/icons-react";
import { useMantineTheme, Button, Notification } from "@mantine/core";
import { StageFavorites } from "./types/StageFavorites";
import { supabase } from "@/utils/supabase";
import classes from "@/styles/Admin/modal.module.css";

interface UpdateButtonsProps {
  setLocalStageFavorites: React.Dispatch<
    React.SetStateAction<StageFavorites | null>
  >;
  favorites: StageFavorites | null; // The original server state
  localFavorites: StageFavorites | null; // The modified local state
  selectedStage: number;
  setFavorites: React.Dispatch<React.SetStateAction<StageFavorites | null>>;
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
    // Revert local changes back to the original fetched data
    setLocalStageFavorites(favorites || null);
  };

  const handleSave = async () => {
    if (!localFavorites) return;

    setLoading(true);

    try {
      // We use 'upsert' to handle both creating new rows or updating existing ones.
      // Ensure your Supabase table name is correct (assumed 'stage_favorites' based on context)
      const { data, error } = await supabase
        .from("stage_favorites")
        .upsert({
          ...localFavorites,
          // Ensure stage_number is set if this is a new record
          stage_number: selectedStage,
        })
        .select();

      if (error) {
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
        throw error;
      }

      // Show success for 2 seconds
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      setFavorites(localFavorites);
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
      }}>
      <div className={classes.buttonGroup}>
        <Button
          bg={theme.colors.red[7]}
          radius={"md"}
          leftSection={<IconRefresh />}
          onClick={handleReset}
          disabled={isDisabled}
          className={classes.updateButton}>
          Reset
        </Button>
        <Button
          bg={theme.colors.teal[7]}
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
        <p style={{ color: theme.colors.teal[7], marginTop: "1rem" }}>
          Endringer lagret!
        </p>
      )}
      {showError && (
        <p style={{ color: theme.colors.red[7], marginTop: "1rem" }}>
          Feil ved lagring av endringer.
        </p>
      )}
    </div>
  );
};

export default UpdateButtons;
