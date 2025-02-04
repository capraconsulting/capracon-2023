import { useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });

  const toggleFavorite = (talkId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(talkId)
        ? prev.filter((id) => id !== talkId)
        : [...prev, talkId];

      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
}
