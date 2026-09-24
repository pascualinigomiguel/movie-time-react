import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../contexts/FavoritesContext";
import "../css/Home.css"; // shares the .movies-grid layout
import "../css/Favorites.css";

function Favorites() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites">
        <header className="page-header">
          <h1>Favorites</h1>
          <p>Movies you save will show up here.</p>
        </header>

        <div className="favorites-empty">
          <div className="favorites-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </div>
          <h2>No favorites yet</h2>
          <p>Tap the heart on any movie and it will be saved to this page.</p>
          <Link to="/" className="favorites-cta">
            Browse movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites">
      <header className="page-header">
        <h1>Favorites</h1>
        <p>
          {favorites.length} saved {favorites.length === 1 ? "movie" : "movies"}
        </p>
      </header>

      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;