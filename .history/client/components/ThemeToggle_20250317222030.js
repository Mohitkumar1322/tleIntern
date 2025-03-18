import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // Get initial theme from localStorage or default to light
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  // Set theme on initial load
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <button 
      className="btn btn-outline-secondary position-fixed top-0 end-0 m-3 rounded-circle"
      style={{ width: '50px', height: '50px' }}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <i className="bi bi-moon-fill"></i>
      ) : (
        <i className="bi bi-sun-fill"></i>
      )}
    </button>
  );
};

export default ThemeToggle;