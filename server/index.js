const express = require("express");
const app = express();

const PORT = 5000;

app.get('/', (request, response) => {
    response.send("Welcome to StreamDopamine! The backend is officially ALIVE! 🚀")
})

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})   