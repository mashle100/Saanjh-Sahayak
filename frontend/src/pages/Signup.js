
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '', role: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.role) {
      setError('Please select a role');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', user);
      const responseData = response.data;
      alert(responseData.msg);
      setUser({ username: '', email: '', password: '', role: '' });
      navigate('/login');
    } catch (error) {
      console.error('Signup Error:', error);
      setError(error.response.data.msg || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={user.username} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={user.password} onChange={handleChange} required />
        </label>
        <label>
          Role:
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="" disabled>Select role</option>
            <option value="staff">Staff</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
