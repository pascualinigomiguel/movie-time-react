import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}

export function FavoritesProvider({ children }) {
  // Load saved favorites once, when the app starts
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Save every time the list changes
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {
      /* storage unavailable (private mode, etc.) */
    }
  }, [favorites]);

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  const toggleFavorite = (movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}