import axios from 'axios';
import { HOST } from "./global-links"


export default axios.create({
    baseURL: HOST,
    withCredentials: true,

});

// update your token in axios instance
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        console.log(axios.defaults.headers.common)
    } else {
        delete axios.defaults.headers.common['token'];

    }
};
