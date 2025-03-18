import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/contests');
      setContests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch contests');
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchContests();
  }, []);

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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No contests found</td>
                </tr>
              ) : (
                contests.map((contest, index) => (
                  <tr key={index}>
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
                      <a href={contest.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-dark">
                        Visit
                      </a>
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