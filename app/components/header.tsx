import React, { useState } from "react";
import { Link } from "@remix-run/react";

import FeatherIcon from "feather-icons-react";
import { useHydrated } from "remix-utils";

import { useTheme } from "~/hooks/useTheme";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isHydrated = useHydrated();

  return (
    <header>
      <nav className="flex w-full items-center justify-between bg-white p-4 dark:bg-black">
        <Link className="flex" to="/">
          CC25
        </Link>
        <div className="flex justify-end">
          {isHydrated && (
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <FeatherIcon icon="moon" className="h-5 w-5" />
              ) : (
                <FeatherIcon icon="sun" className="h-5 w-5" />
              )}
            </button>
          )}
          <div className="relative ml-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              <FeatherIcon icon="menu" className="h-5 w-5" />
            </button>

            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl dark:bg-gray-800">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Program
                </Link>
                <Link
                  to="/praktisk"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Praktisk
                </Link>
                <Link
                  to="/kontakt"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Kontakt
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
