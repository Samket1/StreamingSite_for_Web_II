const express = require("express");
const mongoose = require("mongoose")
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected To MongoDB!"))
    .catch((err) => console.log("Failed to connect: ", err))
const app = express();

const cors = require('cors')
app.use(cors())
app.use(express.json())
const movieSchema = new mongoose.Schema({
    movieId: String,
    title: String,
    posterUrl: String,
    rating: String
})
const Movie = mongoose.model("Movie", movieSchema)
const PORT = 5000;

app.get('/', (request, response) => {
    response.send("Welcome to StreamDopamine! The backend is officially ALIVE! 🚀")

})

app.post('/api/watchlist', async (req, res) => {
    try {
        const movieData = req.body;
        const newMovie = new Movie(movieData)
        await newMovie.save();
        res.status(201).json({ message: "Movie saved perfectly!" })
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong saving the movie." })
    }

})
app.get('/api/watchlist', async (req, res) => {
    try {
        const allMovies = await Movie.find();
        res.status(200).json(allMovies)
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch" });

    }
})
app.delete('/api/watchlist/:id', async (req, res) => {
    try {
        const idToDelete = req.params.id;
        await Movie.findOneAndDelete({ movieId: idToDelete })
        res.status(200).json({ message: "Movie Deleted " })
    }
    catch (error) {
        res.status(500).json({ error: "Could not delete movie" })
    }
}
);
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})   