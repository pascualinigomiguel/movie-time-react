import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getMovieDetails } from "../services/api";
import { useFavorites } from "../contexts/FavoritesContext";
import "../css/MovieModal.css";

function formatRuntime(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

// Prefer an official trailer, then any trailer, then a teaser
function findTrailer(videos = []) {
  const yt = videos.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    null
  );
}

function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);

  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Load genres, runtime, tagline and videos
  useEffect(() => {
    let cancelled = false;
    getMovieDetails(movie.id)
      .then((d) => !cancelled && setDetails(d))
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [movie.id]);

  // Esc to close, lock page scroll, restore focus when closed
  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, []);

  const trailer = findTrailer(details?.videos?.results);
  const backdrop = movie.backdrop_path || details?.backdrop_path;
  const year = movie.release_date?.split("-")[0];
  const runtime = formatRuntime(details?.runtime);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const genres = details?.genres ?? [];

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close details">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div
          className="modal-hero"
          style={backdrop ? { backgroundImage: `url(https://image.tmdb.org/t/p/w780${backdrop})` } : undefined}
        />

        <div className="modal-body">
          <div className="modal-poster">
            {movie.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} />
            ) : (
              <div className="poster-fallback">{movie.title}</div>
            )}
          </div>

          <div className="modal-content">
            <h2 id="modal-title">{movie.title}</h2>
            {details?.tagline && <p className="modal-tagline">{details.tagline}</p>}

            <div className="modal-meta">
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
              {rating && <span className="modal-rating">★ {rating}</span>}
            </div>

            <div className="modal-genres">
              {loading && (
                <>
                  <span className="chip-skeleton" />
                  <span className="chip-skeleton" />
                  <span className="chip-skeleton" />
                </>
              )}
              {genres.map((g) => (
                <span className="chip" key={g.id}>
                  {g.name}
                </span>
              ))}
              {failed && <span className="modal-note">Couldn't load genres and trailer.</span>}
            </div>

            <p className="modal-overview">
              {details?.overview || movie.overview || "No overview available."}
            </p>

            <div className="modal-actions">
              {trailer ? (
                <a
                  className="btn btn-primary"
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
                  </svg>
                  Watch trailer
                </a>
              ) : (
                !failed && (
                  <span className="modal-note">{loading ? "Looking for a trailer…" : "No trailer available."}</span>
                )
              )}

              <button
                className={`btn btn-secondary${favorited ? " active" : ""}`}
                onClick={() => toggleFavorite(movie)}
                aria-pressed={favorited}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
                {favorited ? "Saved" : "Add to favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MovieModal;