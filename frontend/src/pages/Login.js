
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', user);
      const responseData = response.data;
      if (responseData && responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('username', user.username);
        alert('Login successful!');
        setUser({ username: '', password: '' });
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={user.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={user.password} onChange={handleChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
