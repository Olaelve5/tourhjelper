import React, { useEffect } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { IconInfoSmall } from "@tabler/icons-react";
import classes from "@/styles/Import/InfoButton.module.css";
import { useDisclosure } from "@mantine/hooks";

const InforButton = () => {
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (opened) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [opened]);

  return (
    <>
      <Modal
        size="lg"
        opened={opened}
        classNames={classes}
        onClose={close}
        lockScroll={false}
        title="Om importering">
        <p className={classes.textExplanation}>
          For å importere et lag må du bruke enten link eller ID fra
          tourmanager. Linken kan du finne ved å gå til laget du ønsker å
          importere, og kopiere URL-en fra nettleseren. ID finner du i URL-en,
          og er et tall som vanligvis er 9-10 siffer langt.
        </p>
        <div className={classes.exampleContainer}>
          <p>Eksempel på link:</p>
          <p className={classes.idExample}>
            https://tourmanager.no/dashboard/998580/107588044/8
          </p>
        </div>
        <div className={classes.exampleContainer}>
          <p>Eksempel på ID fra URL:</p>
          <p className={classes.idExample}>107588044</p>
        </div>
      </Modal>
      <ActionIcon
        size="lg"
        radius="md"
        className={classes.button}
        onClick={open}>
        <IconInfoSmall size={45} stroke={2} />
      </ActionIcon>
    </>
  );
};

export default InforButton;
