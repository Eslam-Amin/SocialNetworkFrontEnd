import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { HOST } from "../../global-links";
import { useNavigate } from 'react-router-dom';

function VerifyAccount() {
    const navigate = useNavigate();

    const { isFetching, error, dispatch } = useContext(AuthContext);

    let { token } = useParams()

    console.log(token);

    useEffect(() => {
        const verifyAccount = async () => {
            const res = await axios.post(`${HOST}/auth/verify-account/${token}`)
            localStorage.setItem("token", `${res.data.token}`);
            localStorage.setItem("userLoggedIn", true)
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            navigate("/");
        }
        verifyAccount();
    }, [])

    return (
        <div>
            <p>Your Account Is Verified</p>
        </div>
    )
}

export default VerifyAccount
