const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to BlogMaster API');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});