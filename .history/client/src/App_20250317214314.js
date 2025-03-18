import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Use useCallback to memoize the fetchContests function
  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = showBookmarked ? 'bookmarked-contests' : 'contests';
      const response = await axios.get(`http://localhost:5000/api/${endpoint}`);
      setContests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch contests');
      setLoading(false);
    }
  }, [showBookmarked]); // Add showBookmarked as a dependency

  const updateContests = async (platform) => {
    try {
      setLoading(true);
      await axios.get(`http://localhost:5000/api/fetch-${platform.toLowerCase()}`);
      fetchContests();
    } catch (err) {
      setError(`Failed to update ${platform} contests`);
      setLoading(false);
    }
  };

  const toggleBookmark = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/contests/${id}/bookmark`);
      
      // Update the contests array with the updated contest
      setContests(contests.map(contest => 
        contest._id === id ? { ...contest, bookmarked: !contest.bookmarked } : contest
      ));
      
      // If we're showing only bookmarked contests and we just unbookmarked one, remove it from the list
      if (showBookmarked) {
        setContests(contests.filter(contest => 
          contest._id === id ? response.data.bookmarked : true
        ));
      }
    } catch (err) {
      setError('Failed to update bookmark');
    }
  };

  useEffect(() => {
    fetchContests();
  }, [fetchContests]); // Now fetchContests is properly memoized

  // Rest of your component remains the same...
} // Re-fetch when showBookmarked changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Coding Contest Tracker</h1>
      
      <div className="d-flex justify-content-center mb-4">
        <button 
          className="btn btn-primary mx-2" 
          onClick={() => updateContests('Codeforces')}
          disabled={loading}
        >
          Update Codeforces
        </button>
        <button 
          className="btn btn-success mx-2" 
          onClick={() => updateContests('Codechef')}
          disabled={loading}
        >
          Update Codechef
        </button>
        <button 
          className="btn btn-secondary mx-2" 
          onClick={fetchContests}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${!showBookmarked ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowBookmarked(false)}
          >
            All Contests
          </button>
          <button 
            type="button" 
            className={`btn ${showBookmarked ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowBookmarked(true)}
          >
            Bookmarked
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Contest Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Time Remaining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    {showBookmarked ? "No bookmarked contests" : "No contests found"}
                  </td>
                </tr>
              ) : (
                contests.map((contest) => (
                  <tr key={contest._id}>
                    <td>
                      <span className={`badge ${contest.platform === 'Codeforces' ? 'bg-primary' : 'bg-success'}`}>
                        {contest.platform}
                      </span>
                    </td>
                    <td>{contest.name}</td>
                    <td>{formatDate(contest.startTime)}</td>
                    <td>{formatDate(contest.endTime)}</td>
                    <td>{Math.floor(contest.duration / 60)}h {contest.duration % 60}m</td>
                    <td>{calculateTimeRemaining(contest.startTime)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <a 
                          href={contest.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-sm btn-outline-dark"
                        >
                          Visit
                        </a>
                        <button 
                          className={`btn btn-sm ${contest.bookmarked ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => toggleBookmark(contest._id)}
                        >
                          {contest.bookmarked ? (
                            <i className="bi bi-bookmark-fill"></i>
                          ) : (
                            <i className="bi bi-bookmark"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;