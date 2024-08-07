import axios from './axios';

export const loginCall = (userCredentials, dispatch, enqueueSnackbar) => {
    dispatch({ type: "LOGIN_START" });
    axios.post("/auth/login", userCredentials)
        .then(res => res.data)
        .then(res => {
            if (!res.token)
                enqueueSnackbar(res.msg + " Please, check you mail/spam", { variant: "info" })

            localStorage.setItem("token", `${res.token}`);
            localStorage.setItem("userLoggedIn", true)
            dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
            return res.user
        })
        .catch(err => {
            dispatch({ type: "LOGIN_FAILURE", payload: (err) });
            // console.log("err in apiCalls", err)
            let errMsg;
            try {
                if (err.code === "ERR_NETWORK")
                    errMsg = "Network Error, Please try in a minute";
                else
                    errMsg = err.response.data.message
                enqueueSnackbar(errMsg, { variant: "error" })
                return err
            } catch (err) {
                console.log(err, " in apiCalls line 26")
            }
        }
        )
}