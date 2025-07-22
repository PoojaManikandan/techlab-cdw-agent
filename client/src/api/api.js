import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/', // Replace with your API base URL
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