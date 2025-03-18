const axios = require('axios');

// Fetch contests from Codeforces API
const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    
    return response.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({
        platform: 'Codeforces',
        name: contest.name,
        url: `https://codeforces.com/contest/${contest.id}`,
        startTime: new Date(contest.startTimeSeconds * 1000),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
        duration: contest.durationSeconds / 60 // in minutes
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    throw error;
  }
};

// Fetch contests from Codechef (placeholder implementation)
const fetchCodechefContests = async () => {
  try {
    // In a real application, you would implement web scraping here
    // For this example, we'll return placeholder data
    return [
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
  } catch (error) {
    console.error('Error fetching Codechef contests:', error);
    throw error;
  }
};

module.exports = {
  fetchCodeforcesContests,
  fetchCodechefContests
};