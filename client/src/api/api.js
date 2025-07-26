import axios from 'axios';

const REACT_APP_API_GATEWAY_URL = window.REACT_APP_API_GATEWAY_URL;
// Create an Axios instance
const apiClient = axios.create({
  baseURL: REACT_APP_API_GATEWAY_URL, // Replace with your API base URL
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwtToken');
    
    // If the token exists, add it to the Authorization header
    if (token) {
        
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Export the Axios instance
export default apiClient;