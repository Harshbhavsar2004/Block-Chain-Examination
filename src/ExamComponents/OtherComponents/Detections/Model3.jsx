import React, { useState, useEffect } from 'react';
import './Model3.css';

const Model3 = () => {
  const [countdown, setCountdown] = useState(300); // 300 seconds = 5 minutes
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setButtonEnabled(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHome = async () => {
    const token = localStorage.getItem('usersdatatoken'); // Assuming token is saved in localStorage

    try {
      const response = await fetch('https://block-chain-backend.onrender.com/resetCounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle the response as needed
      } else {
        console.error('Failed to reset counts:', response.statusText);
      }

      // Redirect to home page
      window.location.href = '/dash'; // Adjust the URL as per your application
    } catch (error) {
      console.error('Error resetting counts:', error);
    }
  };

  // Format seconds into minutes and seconds for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  return (
    <div className='Model3'>
      <h2>You have been flagged for potential cheating multiple times. Your exam has been blocked.</h2>
      <p>Please contact your exam administrator for further assistance.</p>
      <p>Redirecting to <strong>DashBoard</strong> in {formatTime(countdown)}...</p>
      {buttonEnabled && <button onClick={handleHome}>Go to Home Page</button>}
    </div>
  );
};

export default Model3;
