import axios from 'axios';

const API = axios.create({
    // This automatically picks the right URL
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://ethiofit-api.vercel.app' // Your actual Vercel Backend URL
        : 'http://localhost:5000'
});

export default API;