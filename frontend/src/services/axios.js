
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  // Do not set a global Content-Type so FormData requests can set their own boundary header
  headers: {},
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;

      // If the request data is FormData, remove any Content-Type so the browser adds the correct
      // multipart/form-data; boundary=... header automatically. This prevents 400 Bad Request from
      // servers that require the boundary value.
      if (config.data && typeof FormData !== 'undefined' && config.data instanceof FormData) {
        if (config.headers['Content-Type']) delete config.headers['Content-Type'];
      }
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
        // Refresh token endpoint lives under /api/auth/refresh on the backend
        const response = await axios.post('http://localhost:5000/api/auth/refresh', { refreshToken });
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
