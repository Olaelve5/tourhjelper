import { useState } from "react";
import { IconPencilCheck, IconRefresh } from "@tabler/icons-react";
import { useMantineTheme, Button } from "@mantine/core";
import { StageFavorites } from "../../types/StageFavorites";
import { supabase } from "@/utils/supabase";
import classes from "@/styles/Admin/modal.module.css";

interface UpdateButtonsProps {
  setLocalStageFavorites: React.Dispatch<
    React.SetStateAction<StageFavorites | null>
  >;
  favorites: StageFavorites | null;
  localFavorites: StageFavorites | null;
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
    setLocalStageFavorites(favorites || null);
  };

  const handleSave = async () => {
    if (!localFavorites) return;

    setLoading(true);

    // 1. Create a base payload from your local changes
    const payload: Partial<StageFavorites> = {
      ...localFavorites,
      stage_number: selectedStage,
    };

    // payload.id should match the stage number being edited
    if (favorites && favorites.id) {
      payload.id = favorites.id;
    } else {
      // Delete the ID to prevent overwriting a different stage's row
      delete payload.id;
    }

    try {
      const { data, error } = await supabase
        .from("stage_favorites")
        .upsert(payload)
        .select();

      if (error) {
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
        throw error;
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      if (data && data.length > 0) {
        setFavorites(data[0]);
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
