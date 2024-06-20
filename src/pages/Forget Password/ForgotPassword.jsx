import { useContext, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from "../../axios";
import { HOST } from "../../global-links";


function ForgotPassword() {
    const email = useRef();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [emailSent, setEmailSent] = useState(false)

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate("/register");
    }

    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate("/login");
    }
    const sendResetLink = async (e) => {
        e.preventDefault();

        if (email.current.value.trim().length === 0)
            enqueueSnackbar("Please Enter your email", { variant: 'defualt' });
        else {
            try {

                setEmailSent(true)
                await axios.post(HOST + "/auth/forget-password", { email: email.current.value.trim() })
                enqueueSnackbar("Please check your email", { variant: 'defualt' });
            } catch (err) {
                console.log(err)
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
                    {
                        emailSent ?
                            <p>A link has been sent to your email.</p>
                            :
                            <form className="loginBox">
                                <input type="email" placeholder="Email"
                                    className="loginInput" ref={email} required />
                                <span className="loginForget"
                                    onClick={handleLoginClick}
                                >Log Into your account</span>
                                <button className="loginBtn" onClick={sendResetLink}>
                                    Send Reset Link
                                </button>
                                <button className="loginRegisterBtn" disabled={emailSent} onClick={handleRegisterClick}>
                                    Create a New Account
                                </button>
                            </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
