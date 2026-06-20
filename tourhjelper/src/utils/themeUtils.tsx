import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import React from "react";
import { ThemeId, useTheme } from "@/providers/ThemeProvider";

const yellow: MantineColorsTuple = [
  "#fffce1",
  "#fff8cc",
  "#fff19b",
  "#ffea64",
  "#ffe338",
  "#ffdf1d",
  "#ffdd09",
  "#e3c400",
  "#c9ae00",
  "#ad9500",
];

const green: MantineColorsTuple = [
  "#e6f7ee",
  "#c4ecd5",
  "#9be0b9",
  "#6dd29a",
  "#39c47b",
  "#0fb863",
  "#00a651",
  "#008f45",
  "#007638",
  "#005d2c",
];

const polkaRed: MantineColorsTuple = [
  "#fdecec",
  "#f8c5c5",
  "#f29a9a",
  "#ec6e6e",
  "#e84747",
  "#e52e2e",
  "#e2231a",
  "#c61b14",
  "#a91510",
  "#8c100c",
];

const silver: MantineColorsTuple = [
  "#ffffff",
  "#f7f7f8",
  "#ececef",
  "#dcdde2",
  "#c4c6cd",
  "#a8abb4",
  "#8b94a3",
  "#6b7280",
  "#4c525d",
  "#2f343c",
];

const blue: MantineColorsTuple = [
  "#071524",
  "#122134",
  "#1b2b44",
  "#243b58",
  "#6585b2",
  "#5b7eaf",
  "#4a6c9a",
  "#40608a",
  "#1364a3",
  "#276faf",
];

const ACCENT_BY_THEME: Record<ThemeId, MantineColorsTuple> = {
  yellow,
  green,
  polka: polkaRed,
  white: silver,
};

// Mantine primary color per theme — drives default button/input tint, etc.
const PRIMARY_BY_THEME: Record<ThemeId, string> = {
  yellow: "blue",
  green: "green",
  polka: "red",
  white: "silver",
};

export const buildTheme = (themeId: ThemeId) =>
  createTheme({
    fontFamily: "Open Sans, sans-serif",
    colors: {
      // The "yellow" key stays as the accent slot so existing
      // color="yellow" usages pick up the active theme accent.
      yellow: ACCENT_BY_THEME[themeId],
      blue,
      green,
      red: polkaRed,
      silver,
    },
    primaryColor: PRIMARY_BY_THEME[themeId],
  });

// Backward-compatible export — the default (yellow) theme object.
export const theme = buildTheme("yellow");

export function ThemedMantineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeId } = useTheme();
  const mantineTheme = React.useMemo(() => buildTheme(themeId), [themeId]);
  return <MantineProvider theme={mantineTheme}>{children}</MantineProvider>;
}