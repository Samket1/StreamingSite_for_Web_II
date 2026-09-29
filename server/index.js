const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected To MongoDB!"))
    .catch((err) => console.log("Failed to connect: ", err));

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const movieSchema = new mongoose.Schema({
    username: String,
    movieId: String,
    title: String,
    posterUrl: String,
    rating: String
});

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true,
        match: [/^\w+$/, "Username can only contain letters, numbers, and underscores!"]
    },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", movieSchema);
const PORT = 5000;

app.get('/', (request, response) => {
    response.send("Welcome to StreamDopamine! The backend is officially ALIVE!");
});

app.get('/api/watchlist/:username', async (req, res) => {
    try {
        const userWatchlist = await Movie.find({ username: req.params.username });
        res.status(200).json(userWatchlist);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch" });
    }
});

app.post('/api/watchlist', async (req, res) => {
    try {
        const movieData = req.body;
        const newMovie = new Movie(movieData);
        await newMovie.save();
        res.status(201).json({ message: "Movie saved perfectly!" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong saving the movie." });
    }
});

app.delete('/api/watchlist/:username/:movieId', async (req, res) => {
    try {
        await Movie.findOneAndDelete({
            username: req.params.username,
            movieId: req.params.movieId
        });
        res.status(200).json({ message: "Movie Deleted" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete movie" });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error duriing registeration" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Wrong password!" });
        }
        res.status(200).json({ message: "Login successful!", username: user.username });
    }
    catch (error) {
        res.status(500).json({ error: "Server error during login." });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
