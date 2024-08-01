
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setIsAuthenticated }) => {
//   const [user, setUser] = useState({ username: '', password: '', role: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user.role) {
//       setError('Please select a role');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', user);
//       const responseData = response.data;
//       if (responseData && responseData.token) {
//         localStorage.setItem('token', responseData.token);
//         localStorage.setItem('username', user.username);
//         localStorage.setItem('role', user.role); // Save role to localStorage
//         alert('Login successful!');
//         setUser({ username: '', password: '', role: '' });
//         setIsAuthenticated(true);
//         navigate('/dashboard');
//       } else {
//         setError('Invalid response from server');
//       }
//     } catch (error) {
//       console.error('Login Error:', error.message);
//       setError('Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="login-page">
//       <h2>Login</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username:
//           <input type="text" name="username" value={user.username} onChange={handleChange} required />
//         </label>
//         <label>
//           Password:
//           <input type="password" name="password" value={user.password} onChange={handleChange} required />
//         </label>
//         <label>
//           Role:
//           <select name="role" value={user.role} onChange={handleChange} required>
//             <option value="" disabled>Select role</option>
//             <option value="staff">Staff</option>
//             <option value="doctor">Doctor</option>
//           </select>
//         </label>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState({ username: '', password: '', role: '' });
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
      const response = await axios.post('http://localhost:5000/api/auth/login', user);
      const responseData = response.data;
      if (responseData && responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('role', user.role); // Save role to localStorage
        localStorage.setItem('userId', responseData.userId);
        alert('Login successful!');
        setUser({ username: '', password: '', role: '' });
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.msg : 'Login failed. Please try again.');
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
        <label>
          Role:
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="" disabled>Select role</option>
            <option value="staff">Staff</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;