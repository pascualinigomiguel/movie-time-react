import { useState } from "react";
import "../css/MovieCard.css";
import { useFavorites } from "../contexts/Favoritescontext";
import MovieModal from "./MovieModal";

function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);
  const [open, setOpen] = useState(false);

  function onFavoriteClick(e) {
    e.preventDefault();
    toggleFavorite(movie);
  }

  const year = movie.release_date?.split("-")[0];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <article className="movie-card">
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="poster-fallback">{movie.title}</div>
        )}

        <button
          className="movie-open"
          onClick={() => setOpen(true)}
          aria-label={`View details for ${movie.title}`}
        />

        {rating && (
          <span className="movie-rating" aria-label={`Rated ${rating} out of 10`}>
            ★ {rating}
          </span>
        )}

        <button
          className={`favorite-button${favorited ? " active" : ""}`}
          onClick={onFavoriteClick}
          aria-pressed={favorited}
          aria-label={favorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>

        {movie.overview && (
          <div className="movie-overlay">
            <p className="movie-overview">{movie.overview}</p>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3>
          <button className="movie-title-btn" onClick={() => setOpen(true)}>
            {movie.title}
          </button>
        </h3>
        {year && <p>{year}</p>}
      </div>

      {open && <MovieModal movie={movie} onClose={() => setOpen(false)} />}
    </article>
  );
}

export default MovieCard;