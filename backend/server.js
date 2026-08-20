require("dotenv").config();

const express = require("express");
const cors = require("cors");

const movieRoutes = require("./routes/movies");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Movie Explorer API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});