import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import "./App.css";

const API_URL = "http://localhost:5000/api/movies";
const FAVORITES_KEY = "movie-explorer-favorites";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);

      return savedFavorites
        ? JSON.parse(savedFavorites)
        : [];
    } catch (error) {
      console.error("Failed to load favorites:", error);
      return [];
    }
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      if (isSearching) {
        loadPopularMovies();
      }

      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function loadPopularMovies() {
    try {
      setLoading(true);
      setError("");
      setIsSearching(false);

      const response = await fetch(`${API_URL}/popular`);

      if (!response.ok) {
        throw new Error("Failed to fetch popular movies");
      }

      const data = await response.json();

      setMovies(data.results || []);
    } catch (error) {
      console.error("Popular movies error:", error);
      setError("Unable to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function performSearch(query) {
    try {
      setLoading(true);
      setError("");
      setIsSearching(true);
      setShowFavorites(false);

      const response = await fetch(
        `${API_URL}/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      setMovies(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setError("Unable to search movies. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    setSearchQuery(event.target.value);
  }

  function openMovieDetails(movieId) {
    setSelectedMovieId(movieId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeMovieDetails() {
    setSelectedMovieId(null);
  }

  function toggleFavorite(movie) {
    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some(
        (favorite) => favorite.id === movie.id
      );

      if (alreadyFavorite) {
        return currentFavorites.filter(
          (favorite) => favorite.id !== movie.id
        );
      }

      return [...currentFavorites, movie];
    });
  }

  function isMovieFavorite(movieId) {
    return favorites.some(
      (favorite) => favorite.id === movieId
    );
  }

  function handleFavoritesClick() {
    setShowFavorites(true);
    setIsSearching(false);
    setSearchQuery("");
    setError("");
  }

  function handleHomeClick() {
    setShowFavorites(false);
    setSearchQuery("");
    loadPopularMovies();
  }

  if (selectedMovieId) {
    return (
      <div className="app">
        <MovieDetails
          movieId={selectedMovieId}
          onBack={closeMovieDetails}
        />
      </div>
    );
  }

  const displayedMovies = showFavorites
    ? favorites
    : movies;

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Explorer</h1>

        <nav className="navigation">
          <button
            type="button"
            className={!showFavorites ? "nav-active" : ""}
            onClick={handleHomeClick}
          >
            Home
          </button>

          <button
            type="button"
            className={showFavorites ? "nav-active" : ""}
            onClick={handleFavoritesClick}
          >
            ♥ Favorites ({favorites.length})
          </button>
        </nav>

        <div className="search">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search movies..."
            aria-label="Search movies"
          />

          <button
            type="button"
            onClick={() => {
              const query = searchQuery.trim();

              if (query) {
                performSearch(query);
              } else {
                loadPopularMovies();
              }
            }}
          >
            Search
          </button>
        </div>
      </header>

      <main className="main">
        <h2>
          {showFavorites
            ? "My Favorites"
            : isSearching
            ? `Search Results for "${searchQuery}"`
            : "Popular Movies"}
        </h2>

        {loading && !showFavorites && (
          <p className="status">
            Loading movies...
          </p>
        )}

        {error && (
          <p className="status error">
            {error}
          </p>
        )}

        {showFavorites && favorites.length === 0 && (
          <div className="empty-favorites">
            <h3>No favorite movies yet</h3>

            <p>
              Click the heart on a movie to add it
              to your favorites.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          displayedMovies.length === 0 &&
          !showFavorites && (
            <p className="status">
              No movies found.
            </p>
          )}

        {!loading &&
          !error &&
          displayedMovies.length > 0 && (
            <div className="movie-grid">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={openMovieDetails}
                  isFavorite={isMovieFavorite(movie.id)}
                  onFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default App;