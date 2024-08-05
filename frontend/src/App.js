import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import PatientForm from "./components/PatientForm";
import Login from "./pages/Login";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Signup from "./pages/Signup";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Layout/Footer";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("token") !== null);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Router>
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route
              path="/PatientForm"
              element={
                isAuthenticated ? <PatientForm /> : <Navigate to="/login" />
              }
            />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
