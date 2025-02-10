import { useState } from "react";

export function useFavorites() {
  const getStoredFavorites = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  };

  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);

  const toggleFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
    talkId: string,
  ) => {
    event.preventDefault();

    const currentFavorites = getStoredFavorites();
    const updatedFavorites = currentFavorites.includes(talkId)
      ? currentFavorites.filter((id) => id !== talkId)
      : [...currentFavorites, talkId];

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return { favorites, toggleFavorite };
}
