import { ActionIcon } from "@mantine/core";
import {IconInfoSmall} from "@tabler/icons-react";
import classes from "@/styles/Import/InfoButton.module.css";


const InforButton = () => {
  return (
    <ActionIcon size="lg" radius="md" className={classes.button}>
      <IconInfoSmall size={45} stroke={2} />
    </ActionIcon>
  );
};

export default InforButton;
