import { createContext, useContext, useEffect, useState } from "react";

import { useHydrated } from "remix-utils";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.LIGHT,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useHydrated();

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return Theme.LIGHT;
    return (localStorage.getItem("theme") as Theme) || Theme.LIGHT;
  });

  useEffect(() => {
    if (!isHydrated) return;

    const root = window.document.documentElement;
    root.classList.remove(Theme.LIGHT, Theme.DARK);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
