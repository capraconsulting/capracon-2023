import { NavLink } from "@remix-run/react";

import { List, Moon, Sun } from "phosphor-react";
import { useHydrated } from "remix-utils";

import { Theme, useTheme } from "~/hooks/useTheme";

type MobileMenuProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const MobileMenu = ({ isOpen, setIsOpen }: MobileMenuProps) => {
  const { theme, toggleTheme } = useTheme();
  const isHydrated = useHydrated();

  return (
    <div className="relative desktop:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-300"
      >
        <List className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl dark:bg-gray-800">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? "border-l-4 border-current" : ""
              }`
            }
          >
            Praktisk
          </NavLink>
          <NavLink
            to="/program"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? "border-l-4 border-current" : ""
              }`
            }
          >
            Program
          </NavLink>
          <NavLink
            to="/speakers"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? "border-l-4 border-current" : ""
              }`
            }
          >
            Speakers
          </NavLink>
          <NavLink
            to="/kontakt"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? "border-l-4 border-current" : ""
              }`
            }
          >
            Kontakt
          </NavLink>

          {isHydrated && (
            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="mr-2">Modus</span>
              {theme === Theme.DARK ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
