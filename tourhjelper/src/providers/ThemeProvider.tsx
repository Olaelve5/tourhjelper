import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeId = "yellow" | "green" | "polka" | "white";

export type ThemeDef = {
  id: ThemeId;
  label: string;
  accent: string;
  accentHover: string;
  accentDisabled: string;
  accentContrast: string;
  glow: string;
  /** Color used for the bike SVG strokes/fills in the updating page.
   *  Usually matches accent, but for the polka theme we keep a white
   *  bike and let the red polka dots provide the theme signal. */
  bikeColor: string;
  swatchStyle: React.CSSProperties;
};

export const THEMES: ThemeDef[] = [
  {
    id: "yellow",
    label: "Gul trøye",
    accent: "#ffdd09",
    accentHover: "#ffdd00da",
    accentDisabled: "#ffdd09a6",
    accentContrast: "#0c131c",
    glow: "rgba(255, 221, 9, 0.5)",
    bikeColor: "#ffdd09",
    swatchStyle: { backgroundColor: "#ffdd09" },
  },
  {
    id: "green",
    label: "Grønn trøye",
    accent: "#00a651",
    accentHover: "#00b85ada",
    accentDisabled: "#00a651a6",
    accentContrast: "#ffffff",
    glow: "rgba(0, 166, 81, 0.5)",
    bikeColor: "#00a651",
    swatchStyle: { backgroundColor: "#00a651" },
  },
  {
    id: "polka",
    label: "Prikkete trøye",
    accent: "#e2231a",
    accentHover: "#ff2e23da",
    accentDisabled: "#e2231aa6",
    accentContrast: "#ffffff",
    glow: "rgba(226, 35, 26, 0.55)",
    bikeColor: "#ffffff",
    swatchStyle: {
      backgroundColor: "#ffffff",
      backgroundImage:
        "radial-gradient(circle, #e2231a 1.5px, transparent 2px)",
      backgroundSize: "6px 6px",
    },
  },
  {
    id: "white",
    label: "Hvit trøye",
    accent: "#e6e6e6",
    accentHover: "#ffffffda",
    accentDisabled: "#e6e6e6a6",
    accentContrast: "#1c2128",
    glow: "rgba(255, 255, 255, 0.45)",
    bikeColor: "#e6e6e6",
    swatchStyle: { backgroundColor: "#e6e6e6" },
  },
];

const DEFAULT_THEME: ThemeId = "yellow";
const STORAGE_KEY = "tourhjelper-theme";

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeDef;
  setThemeId: (id: ThemeId) => void;
  themes: ThemeDef[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};

function isThemeId(value: string | null): value is ThemeId {
  return (
    value === "yellow" ||
    value === "green" ||
    value === "polka" ||
    value === "white"
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME);

  // Load persisted theme after mount to avoid SSR mismatch.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isThemeId(stored)) {
        setThemeIdState(stored);
      }
    } catch {
      // localStorage unavailable; keep default.
    }
  }, []);

  // Reflect the active theme on the document root so global CSS can react.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", themeId);
  }, [themeId]);

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore persistence errors
    }
  };

  const value = useMemo<ThemeContextType>(() => {
    const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    return { themeId, theme, setThemeId, themes: THEMES };
  }, [themeId]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
