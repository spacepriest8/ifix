const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../db');
const userRoutes = require('../routes/v1/userRoute');
const jobRoutes = require('../routes/v1/jobRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
app.use(express.json());

// Use routes




app.use('/v1/user', userRoutes);  // Authentication routes
app.use('/v1/jobs', jobRoutes);    // Job routes

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to ifix');
});

module.exports = app;