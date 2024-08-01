
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authtoken');
localStorage.removeItem('username');
localStorage.removeItem('role');
    setIsAuthenticated(false);

    window.location.href = '/login';
  };

  return (
    <header className="header">
      <h1>Saanjh Sahayak</h1>
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
                <NavLink to="/PatientForm" activeClassName="active">
                PatientForm
                </NavLink>
                
              </li>
              <li>
              <NavLink to="/chatbot" activeClassName="active">
                  Chatbot
                </NavLink>
                
              </li>
              <li>
              <NavLink to="/about" activeClassName="active">
                  About
                </NavLink>
                
              </li>
              <li>
              <NavLink to="/faq" activeClassName="active">
                  FAQ
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
