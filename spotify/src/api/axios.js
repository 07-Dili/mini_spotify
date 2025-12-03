import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://mini-spotify-2dtb.onrender.com/api', //deployed server
    baseURL: 'http://localhost:5000/api', //local server
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },  
    (error) => Promise.reject(error)
);

export default api;
