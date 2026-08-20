import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/movies";

function MovieDetails({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${movieId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Movie not found");
          }

          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Movie details error:", error);
        setError(error.message || "Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <main className="details-page">
        <p className="status">Loading movie details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="details-page">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <p className="status error">{error}</p>
      </main>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <main className="details-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Movies
      </button>

      <section className="details-hero">
        {movie.backdrop_path && (
          <img
            className="details-backdrop"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
          />
        )}

        <div className="details-overlay"></div>

        <div className="details-content">
          {movie.poster_path && (
            <img
              className="details-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          )}

          <div className="details-info">
            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="tagline">
                "{movie.tagline}"
              </p>
            )}

            <div className="details-meta">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>

              <span>
                {movie.release_date || "Release date unavailable"}
              </span>

              {movie.runtime && (
                <span>
                  {Math.floor(movie.runtime / 60)}h{" "}
                  {movie.runtime % 60}m
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="details-overview">
              {movie.overview || "No overview available."}
            </p>

            <p className="details-status">
              Status: {movie.status || "Unknown"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
