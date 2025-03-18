const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');
const { fetchCodeforcesContests, fetchCodechefContests } = require('../utils/fetchContests');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`Contest route: ${req.method} ${req.originalUrl}`);
  next();
});

// Get all contests
router.get('/contests', async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookmarked contests
router.get('/bookmarked-contests', async (req, res) => {
  try {
    const contests = await Contest.find({ bookmarked: true }).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle bookmark status - PATCH route
router.patch('/contests/:id/bookmark', async (req, res) => {
  try {
    console.log(`Processing bookmark toggle for contest ID: ${req.params.id}`);
    
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      console.log(`Contest not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Contest not found' });
    }
    
    contest.bookmarked = !contest.bookmarked;
    const updatedContest = await contest.save();
    
    console.log(`Updated contest ${updatedContest._id}, bookmark status: ${updatedContest.bookmarked}`);
    res.json(updatedContest);
  } catch (error) {
    console.error(`Error in bookmark route: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// Fetch Codeforces contests
router.get('/fetch-codeforces', async (req, res) => {
  try {
    const contests = await fetchCodeforcesContests();
    
    // Get current bookmarked contests to preserve bookmark status
    const bookmarkedContests = await Contest.find({ 
      platform: 'Codeforces', 
      bookmarked: true 
    }, '_id name');
    
    const bookmarkedNames = new Set(bookmarkedContests.map(c => c.name));
    
    // Preserve bookmark status for existing contests
    const contestsToSave = contests.map(contest => ({
      ...contest,
      bookmarked: bookmarkedNames.has(contest.name)
    }));
    
    // Save to database
    await Contest.deleteMany({ platform: 'Codeforces' });
    await Contest.insertMany(contestsToSave);
    
    res.json({ message: 'Codeforces contests updated', count: contests.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch Codechef contests
router.get('/fetch-codechef', async (req, res) => {
  try {
    const contests = await fetchCodechefContests();
    
    // Get current bookmarked contests to preserve bookmark status
    const bookmarkedContests = await Contest.find({ 
      platform: 'Codechef', 
      bookmarked: true 
    }, '_id name');
    
    const bookmarkedNames = new Set(bookmarkedContests.map(c => c.name));
    
    // Preserve bookmark status for existing contests
    const contestsToSave = contests.map(contest => ({
      ...contest,
      bookmarked: bookmarkedNames.has(contest.name)
    }));
    
    // Save to database
    await Contest.deleteMany({ platform: 'Codechef' });
    await Contest.insertMany(contestsToSave);
    
    res.json({ message: 'Codechef contests updated', count: contests.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make sure to export the router
module.exports = router;