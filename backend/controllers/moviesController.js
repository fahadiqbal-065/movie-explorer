const TMDB_URL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    "Content-Type": "application/json"
};

// GET /api/movies/popular
const getPopularMovies = async (req, res) => {
    try {
        const response = await fetch(
            `${TMDB_URL}/movie/popular?language=en-US&page=1`,
            {
                headers
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({
                message: "Failed to fetch popular movies from TMDB"
            });
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while fetching popular movies"
        });
    }
};

// GET /api/movies/search?query=batman
const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const response = await fetch(
            `${TMDB_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
            {
                headers
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({
                message: "Failed to search movies on TMDB"
            });
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while searching movies"
        });
    }
};

// GET /api/movies/:id
const getMovieDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await fetch(
            `${TMDB_URL}/movie/${id}?language=en-US`,
            {
                headers
            }
        );

        if (response.status === 404) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                message: "Failed to fetch movie details from TMDB"
            });
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while fetching movie details"
        });
    }
};

module.exports = {
    getPopularMovies,
    searchMovies,
    getMovieDetails
};