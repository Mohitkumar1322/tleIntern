const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');
const { fetchCodeforcesContests, fetchCodechefContests } = require('../utils/fetchContests');

// Get all contests
router.get('/contests', async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/bookmarked-contests', async (req, res) => {
    try {
      const contests = await Contest.find({ bookmarked: true }).sort({ startTime: 1 });
      res.json(contests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Toggle bookmark status
  router.patch('/contests/:id/bookmark', async (req, res) => {
    try {
      const contest = await Contest.findById(req.params.id);
      
      if (!contest) {
        return res.status(404).json({ message: 'Contest not found' });
      }
      
      contest.bookmarked = !contest.bookmarked;
      const updatedContest = await contest.save();
      
      res.json(updatedContest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Fetch Codeforces contests
router.get('/fetch-codeforces', async (req, res) => {
  try {
    const contests = await fetchCodeforcesContests();
    
    // Save to database
    await Contest.deleteMany({ platform: 'Codeforces' });
    await Contest.insertMany(contests);
    
    res.json({ message: 'Codeforces contests updated', count: contests.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch Codechef contests
router.get('/fetch-codechef', async (req, res) => {
  try {
    const contests = await fetchCodechefContests();
    
    // Save to database
    await Contest.deleteMany({ platform: 'Codechef' });
    await Contest.insertMany(contests);
    
    res.json({ message: 'Codechef contests updated', count: contests.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;