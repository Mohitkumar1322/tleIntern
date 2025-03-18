const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
import Contest from "../models/ContestYT.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contest-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const contestRoutes = require('./routes/contests');

// Use routes - make sure this is correct
app.use('/api', contestRoutes);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Error handling for undefined routes
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});