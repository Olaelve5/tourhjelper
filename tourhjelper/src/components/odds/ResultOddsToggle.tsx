import React from "react";
import { IconListNumbers, IconCoins } from "@tabler/icons-react";
import classes from "@/styles/Odds/ResultOddsToggle.module.css";
import { Button } from "@mantine/core";

interface ResultOddsToggleProps {
  showResults: boolean;
  onToggle: (showResults: boolean) => void;
}

const ResultOddsToggle = ({ showResults, onToggle }: ResultOddsToggleProps) => {
  return (
    <div className={classes.container}>
      <Button
        className={showResults ? classes.buttonActive : classes.button}
        onClick={() => onToggle(true)}
        leftSection={<IconListNumbers size={16} />}>
        Resultater
      </Button>
      <Button
        className={!showResults ? classes.buttonActive : classes.button}
        onClick={() => onToggle(false)}
        leftSection={<IconCoins size={16} />}>
        Odds
      </Button>
    </div>
  );
};

export default ResultOddsToggle;
