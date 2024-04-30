import "./login.css";
import { useSnackbar } from 'notistack';


import { useContext, useRef, useState } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate()
    const email = useRef();
    const { enqueueSnackbar } = useSnackbar();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const password = useRef();
    const { isFetching, error, dispatch } = useContext(AuthContext);
    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate("/register");
    }

    const handleLoginClick = async (e) => {
        e.preventDefault();
        const res = await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
        const errMsg = !error ? "Either mail or password is INVALID" : (error);
        if (res)
            enqueueSnackbar(errMsg, { variant: 'error' });
    }



    const passwordVisibility = () => {
        if (password.current.type === "password")
            password.current.type = "text";
        else
            password.current.type = "password";

        setPasswordVisible(!passwordVisible)
    }


    return (
        <div className="login">
            <div className="loginWrapper" >

                <div className="loginLeft">
                    <h3 className="loginLogo">Social Network</h3>
                    <span className="loginDesc">
                        Connect With Friends and the world around you on Social Network.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleLoginClick}>

                        <input type="email" placeholder="Email"
                            className="loginInput" ref={email} required />
                        <span className="passwordField">
                            <input type="password" placeholder="Password"
                                className="loginInput passwordInput" ref={password} required minLength={6} />
                            {
                                passwordVisible ?
                                    <VisibilityOffIcon className="visibleIcon" onClick={passwordVisibility} />
                                    :
                                    <VisibilityIcon className="visibleIcon" onClick={passwordVisibility} />
                            }
                        </span>
                        <span className="loginForget">Forget Password?</span>
                        <button className="loginBtn" disabled={isFetching}>
                            {isFetching ?
                                <CircularProgress color="inherit" size="25px" />
                                : "Log In"}
                        </button>
                        <button className="loginRegisterBtn" disabled={isFetching} onClick={handleRegisterClick}>
                            {isFetching ?
                                <CircularProgress color="inherit" size="25px" />
                                : "Create a New Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}



export default Login
