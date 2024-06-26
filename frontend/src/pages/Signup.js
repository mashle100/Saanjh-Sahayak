import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', user);
      const responseData = response.data;
      console.log('Signup Response:', responseData);
      alert(responseData.msg);
      setUser({ username: '', email: '', password: '' });
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
// src/pages/Signup.js

// import React, { useState } from 'react';
// import axios from 'axios';

// const Signup = () => {
//   const [user, setUser] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', user);
//       console.log('Signup Response:', response.data);
//       alert('Signup successful!');
//       setUser({ username: '', password: '' });
//     } catch (error) {
//       console.error('Signup Error:', error.message);
//       setError('Signup failed. Please try again.');
//     }
//   };

//   return (
//     <div className="signup-page">
//       <h2>Signup</h2>
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
//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;
