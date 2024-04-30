import axios from 'axios';
import { HOST } from "./global-links"
import { setAuthToken } from "./axios.js";

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post(HOST + "/auth/login", userCredentials)
        localStorage.setItem("token", (res.data.data.token));

        setAuthToken(res.data.data.token);// CALLING THIS FUNCTION
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data.user });
        // sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: (err.response.data.error) });
        return true;
    }
}