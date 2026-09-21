import axios from 'axios';

const axiosInstance = axios.create({
  // Force absolute URL to avoid proxy confusion
  baseURL: 'http://localhost:5000/api', 
  headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;