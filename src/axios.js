import axios from 'axios';
import { HOST } from "./global-links"

const getTokenFromLocalStorage = () => {
    try {

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        // Retrieve token from localStorage
        return headers;
    } catch (error) {
        console.error('Error retrieving token from localStorage:', error);
        return null;
    }
};

// Usage:
// const headers = getTokenFromLocalStorage();


export default axios.create({
    baseURL: HOST,
});

// update your token in axios instance
export const setAuthToken = (token) => {
    if (token) {
        console.log('[axios] confirm new token update  ===>', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        localStorage.setItem("token", token)
        console.log(axios.defaults.headers.common)
    } else {
        delete axios.defaults.headers.common['token'];

    }
};
