
import React from 'react';

const Dashboard = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      {isAuthenticated ? (
        <>
          <p>Welcome, {username}!</p>
          <p>You are logged in.</p>
        </>
      ) : (
        <p>Welcome! You are not logged in.</p>
      )}
    </div>
  );
};

export default Dashboard;
