import axios, { setAuthToken } from './axios';

export const loginCall = (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        axios.post("/auth/login", userCredentials)
            .then(res => res.data)
            .then(res => {
                localStorage.setItem("user", JSON.stringify(res.user))
                dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
            })
            .catch(err => console.log(err))
        // localStorage.setItem("token", (res.data.token));
        // setAuthToken(res.data.token);// CALLING THIS FUNCTION

        // sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
    } catch (err) {
        console.log(err)
        dispatch({ type: "LOGIN_FAILURE", payload: (err) });
        return true;
    }
}