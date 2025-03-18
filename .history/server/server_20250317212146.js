const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contest-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Contest Schema
const contestSchema = new mongoose.Schema({
  platform: String,
  name: String,
  url: String,
  startTime: Date,
  endTime: Date,
  duration: Number
});

const Contest = mongoose.model('Contest', contestSchema);

// Routes
app.get('/api/contests', async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch Codeforces contests
app.get('/api/fetch-codeforces', async (req, res) => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({
        platform: 'Codeforces',
        name: contest.name,
        url: `https://codeforces.com/contest/${contest.id}`,
        startTime: new Date(contest.startTimeSeconds * 1000),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
        duration: contest.durationSeconds / 60 // in minutes
      }));

    // Save to database
    await Contest.deleteMany({ platform: 'Codeforces' });
    await Contest.insertMany(contests);
    
    res.json({ message: 'Codeforces contests updated', count: contests.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch Codechef contests
app.get('/api/fetch-codechef', async (req, res) => {
  try {
    // Codechef doesn't have a public API, so we'll use web scraping in a real app
    // For this example, we'll just add some placeholder data
    const contests = [
      {
        platform: 'Codechef',
        name: 'Long Challenge',
        url: 'https://www.codechef.com/contests',
        startTime: new Date(Date.now() + 86400000), // tomorrow
        endTime: new Date(Date.now() + 86400000 + 864000000), // 10 days after start
        duration: 14400 // in minutes
      },
      {
        platform: 'Codechef',
        name: 'Cook-Off',
        url: 'https://www.codechef.com/contests',
        startTime: new Date(Date.now() + 172800000), // day after tomorrow
        endTime: new Date(Date.now() + 172800000 + 10800000), // 3 hours after start
        duration: 180 // in minutes
      }
    ];

    // Save to database
    await Contest.deleteMany({ platform: 'Codechef' });
    await Contest.insertMany(contests);
    
    res.json({ message: 'Codechef contests updated', count: contests.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});