
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <h1>Your App Name</h1>
      <nav>
        <ul>
        <li>
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
        </li>
          {isAuthenticated ? (
            <>
              
              <li>
                <NavLink to="/health-records" activeClassName="active">
                  Health Records
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
            <li>
              <Link to="/login" className="login-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="signup-link">
                signup
              </Link>
            </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
