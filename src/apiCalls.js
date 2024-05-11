import axios from './axios';

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("/auth/login", userCredentials)
        // localStorage.setItem("token", (res.data.token));

        localStorage.setItem("user", JSON.stringify(res.data.user));
        // setAuthToken(res.data.token);// CALLING THIS FUNCTION

        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
        // sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
    } catch (err) {
        console.log(err)
        dispatch({ type: "LOGIN_FAILURE", payload: (err.response.error) });
        return true;
    }
}