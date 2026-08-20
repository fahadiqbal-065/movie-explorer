const express = require("express");

const {
    getPopularMovies,
    searchMovies,
    getMovieDetails
} = require("../controllers/moviesController");

const router = express.Router();

router.get("/popular", getPopularMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieDetails);

module.exports = router;