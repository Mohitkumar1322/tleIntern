import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ThemeToggle from './components/ThemeToggle';

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
  }, [showBookmarked]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = showBookmarked ? 'bookmarked-contests' : 'contests';
        const response = await axios.get(`http://localhost:5000/api/${endpoint}`);
        console.log('Fetched contests:', response.data);
        // Check the format of the IDs
        if (response.data.length > 0) {
          console.log('Sample contest ID:', response.data[0]._id);
        }
        setContests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('Failed to fetch contests');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showBookmarked]);

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
      console.log(`Attempting to toggle bookmark for contest ID: ${id}`);
      
      // Log the full URL being requested
      const url = `http://localhost:5000/api/contests/${id}/bookmark`;
      console.log(`Making PATCH request to: ${url}`);
      
      const response = await axios.patch(url);
      console.log('Bookmark toggle successful:', response.data);
      
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
      console.error('Error toggling bookmark:', err.response ? err.response.data : err.message);
      // Log the full error object for debugging
      console.error('Full error object:', err);
      setError(`Failed to update bookmark: ${err.response ? err.response.data.message : err.message}`);
    }
  };

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
    <div className="app">
      <ThemeToggle />
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
                            className="btn btn-sm btn-outline-primary"
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
    </div>
    const AddContestForm = () => {
      const [name, setName] = useState("");
      const [youtubeLink, setYoutubeLink] = useState("");
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          const response = await fetch("http://localhost:5000/api/contests/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, youtubeLink }),
          });
  
          if (response.ok) {
              alert("Contest link added successfully!");
              setName("");
              setYoutubeLink("");
          } else {
              alert("Error adding contest link");
          }
      };
  
      return (
          <div className="p-4">
              <h2 className="text-xl font-bold">Add Contest Solution Link</h2>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                  <input
                      type="text"
                      placeholder="Contest Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border p-2"
                      required
                  />
                  <input
                      type="text"
                      placeholder="YouTube Link"
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      className="border p-2"
                      required
                  />
                  <button type="submit" className="bg-blue-500 text-white p-2">
                      Submit
                  </button>
              </form>
          </div>
      );
  };
  );
}

export default App;