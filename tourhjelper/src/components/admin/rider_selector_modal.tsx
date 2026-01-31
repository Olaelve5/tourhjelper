import { Modal, Button, Input, useMantineTheme } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import classes from "@/styles/Admin/modal.module.css";
import RiderList from "./rider_list";
import { StageFavorites } from "./types/StageFavorites";

interface RiderSelectorModalProps {
  setLocalStageFavorites: Dispatch<SetStateAction<StageFavorites | null>>;
  localFavorites?: StageFavorites | null;
}

const RiderSelectorModal = ({
  setLocalStageFavorites,
  localFavorites,
}: RiderSelectorModalProps) => {
  const [opened, setOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useMantineTheme();

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size={"lg"}
        withCloseButton={false}
        radius={10}
        classNames={classes}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          className={classes.searchInput}
          placeholder="Søk..."
        />
        <RiderList
          searchTerm={searchTerm}
          setStageFavorites={setLocalStageFavorites}
          stageFavorites={localFavorites}
        />
      </Modal>
      <Button
        size="sm"
        onClick={() => setOpened(true)}
        radius={"md"}
        bg={theme.colors.teal[8]}>
        Finn Ryttere
      </Button>
    </div>
  );
};

export default RiderSelectorModal;
