import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authtoken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <header className="bg-blue-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Saanjh Sahayak</h1>
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/dashboard" className="hover:text-blue-300">
            Dashboard
          </NavLink>
          {isAuthenticated ? (
            <>
              {/* <NavLink to="/PatientForm" className="hover:text-blue-300">
                Patient Form
              </NavLink> */}
              <NavLink to="/chatbot" className="hover:text-blue-300">
                Chatbot
              </NavLink>
              <NavLink to="/about" className="hover:text-blue-300">
                About
              </NavLink>
              <NavLink to="/faq" className="hover:text-blue-300">
                FAQ
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center hover:text-red-400"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center hover:text-blue-300"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center hover:text-blue-300"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
        <button className="md:hidden p-2" aria-label="Menu">
          <FaBars className="text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;
