import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import classes from "@/styles/ThemeSwitcher.module.css";

export function ThemeSwitcher() {
  const { themes, theme, setThemeId } = useTheme();

  return (
    <div
      className={classes.switcher}
      role="radiogroup"
      aria-label="Velg tema">
      {themes.map((t) => {
        const isActive = t.id === theme.id;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={t.label}
            title={t.label}
            onClick={() => setThemeId(t.id)}
            className={`${classes.swatch} ${isActive ? classes.swatchActive : ""}`}
            style={t.swatchStyle}
          />
        );
      })}
    </div>
  );
}

export default ThemeSwitcher;
