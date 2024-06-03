import { useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from "../../axios";
import { HOST } from "../../global-links";
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";



function ResetPassword() {
    const password = useRef();
    const passwordConfirm = useRef();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { isFetching, dispatch } = useContext(AuthContext);

    let { token } = useParams();
    console.log(token)
    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate("/login");
    }
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password.current.value.trim() !== passwordConfirm.current.value.trim())
            enqueueSnackbar("Password Don't match", { variant: 'error' });
        else {
            try {

                const res = await axios.post(`${HOST}/auth/reset-password/${token}`, { password: password.current.value.trim() })
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                localStorage.setItem("userLoggedIn", true)
                navigate("/")


            }
            catch (err) {
                console.log(err)
                enqueueSnackbar("Token is invalid or has expired, please send reset mail again.", { variant: 'error' });
            }

        }
    }

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social Network</h3>
                    <span className="loginDesc">
                        Connect With Friends and the world around you on Social Network.
                    </span>
                </div>
                <div className="loginRight">


                    <form className="loginBox">
                        <input type="password" placeholder="Password"
                            className="loginInput" ref={password} required />
                        <input type="password" placeholder="confirm Password"
                            className="loginInput" ref={passwordConfirm} required />
                        <span className="loginForget"
                            onClick={handleLoginClick}
                        >Log Into your account</span>
                        <button className="loginBtn" onClick={handleResetPassword}>
                            Reset Password
                        </button>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default ResetPassword
