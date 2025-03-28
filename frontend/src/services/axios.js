
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;

  if (error.response && error.response.status === 401) {
    // Handle unauthorized errors, possibly refresh the token
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        const response = await axios.post('http://localhost:5000/api/refresh', { refreshToken });
        const newAccessToken = response.data.accessToken;

        localStorage.setItem('token', newAccessToken);
        originalRequest.headers['x-auth-token'] = newAccessToken;

        return instance(originalRequest);
      } catch (err) {
        console.error('Refresh Token Error:', err);
        // Handle error, e.g., redirect to login
      }
    }
  }

  return Promise.reject(error);
});

export default instance;
