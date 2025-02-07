import { NavLink } from "@remix-run/react";

import { Moon, Sun } from "phosphor-react";
import { useHydrated } from "remix-utils";

import { Theme, useTheme } from "~/hooks/useTheme";

export const DesktopMenu = () => {
  const { theme, toggleTheme } = useTheme();
  const isHydrated = useHydrated();

  return (
    <nav className="hidden items-center gap-8 desktop:flex">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `relative hover:text-gray-600 dark:hover:text-gray-300 ${
            isActive
              ? "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-current"
              : ""
          }`
        }
      >
        Praktisk
      </NavLink>
      <NavLink
        to="/program"
        className={({ isActive }) =>
          `relative hover:text-gray-600 dark:hover:text-gray-300 ${
            isActive
              ? "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-current"
              : ""
          }`
        }
      >
        Program
      </NavLink>
      <NavLink
        to="/speakers"
        className={({ isActive }) =>
          `relative hover:text-gray-600 dark:hover:text-gray-300 ${
            isActive
              ? "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-current"
              : ""
          }`
        }
      >
        Speakers
      </NavLink>
      <NavLink
        to="/kontakt"
        className={({ isActive }) =>
          `relative hover:text-gray-600 dark:hover:text-gray-300 ${
            isActive
              ? "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-current"
              : ""
          }`
        }
      >
        Kontakt
      </NavLink>

      {isHydrated && (
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === Theme.DARK ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      )}
    </nav>
  );
};
