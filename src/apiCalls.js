import axios from 'axios';
export const loginCall = async (userCredentials, dispatch) => {
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";

    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post(HOST + "/auth/login", userCredentials);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        localStorage.setItem("userId", (res.data._id));
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: (err.response.data) });
        return true;
    }
}