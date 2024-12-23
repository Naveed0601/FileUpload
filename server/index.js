const express = require('express');
const cors = require("cors");
const fileRouter = require('./Routes/FileRouter'); // Ensure this file exists

const app = express();
const port = 8000;

require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple /hii route
// app.get('/hii', async (req, res) => {
//     res.send("Connected");
// });

// Use API router
app.use('/', fileRouter); // Adjust prefix to avoid route conflicts

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
