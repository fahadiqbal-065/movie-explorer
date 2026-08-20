function MovieCard({ movie, onClick, isFavorite, onFavorite }) {
  function handleFavoriteClick(event) {
    event.stopPropagation();
    onFavorite(movie);
  }

  return (
    <article
      className="movie-card"
      onClick={() => onClick(movie.id)}
      role="button"
      tabIndex="0"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick(movie.id);
        }
      }}
    >
      <div className="poster-container">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <div className="no-poster">
            No Poster
          </div>
        )}

        <button
          type="button"
          className={`favorite-button ${
            isFavorite ? "favorite-active" : ""
          }`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p className="release-date">
          {movie.release_date || "Release date unavailable"}
        </p>

        <p className="rating">
          ⭐ {movie.vote_average?.toFixed(1)}
        </p>

        <p className="overview">
          {movie.overview || "No overview available."}
        </p>
      </div>
    </article>
  );
}

export default MovieCard;