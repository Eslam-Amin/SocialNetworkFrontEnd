import { useRef, useState } from "react";
import { useSnackbar } from 'notistack';
import "./register.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Register() {
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";

    const { enqueueSnackbar } = useSnackbar();

    const email = useRef();
    const password = useRef();
    const confirmationPassword = useRef();
    const fname = useRef();
    const lname = useRef();
    const desc = useRef();
    const city = useRef();
    const from = useRef();
    const relationship = useRef();
    const [isFetching, setIsfetching] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmationPasswordVisible, setconfirmationPasswordVisible] = useState(false);
    const [eyeVisible, setEyeVisible] = useState(false);


    const navigate = useNavigate();

    const getUsernameFromNameEntry = (fname, lname) => {
        const username = fname.charAt(0).toUpperCase() + fname.slice(1).trim()
            + lname.charAt(0).toUpperCase() + lname.slice(1).trim();
        console.log(username);
        return username;
    }
    const handleRegisterClick = async (e) => {
        e.preventDefault();
        const uname = fname.current.value + " " + lname.current.value.toString();
        setIsfetching(true);
        if (password.current.value !== confirmationPassword.current.value) {
            confirmationPassword.current.setCustomValidity("Passwords Don't Match!!");
            setIsfetching(false);
        } else {
            const user = {
                name: uname,
                username: getUsernameFromNameEntry(fname.current.value, lname.current.value),
                email: email.current.value,
                relationship: relationship.current.value,
                city: city.current.value,
                from: from.current.value,
                desc: desc.current.value,
                password: password.current.value
            }

            try {

                await axios.post(HOST + "/auth/register", user);
                navigate("/login");
            } catch (err) {
                //console.log(Object.keys(err.response.data.keyValue)[0]);
                enqueueSnackbar("Duplicated " + Object.keys(err.response.data.keyValue)[0], { variant: 'error' });
                setIsfetching(false)
            }

        }


    }

    const handleEyeIcon = () => {
        setEyeVisible(true);

    }



    const passwordVisibility = () => {
        if (password.current.type == "password") {
            password.current.type = "text";
        }
        else {
            password.current.type = "password";
        }

        setPasswordVisible(!passwordVisible)
    }
    const passwordConfirmatonVisibility = () => {
        if (confirmationPassword.current.type == "password")
            confirmationPassword.current.type = "text";

        else
            confirmationPassword.current.type = "password";


        setconfirmationPasswordVisible(!confirmationPasswordVisible)
    }


    const handleLoginClick = () => {
        navigate("/login");
        console.log("CLicked")
    }
    return (
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <h3 className="registerLogo">Social Network</h3>
                    <span className="registerDesc">
                        Connect With Friends and the world around you on Social Network.
                    </span>
                </div>
                <div className="registerRight">

                    <form autoComplete="off" className="registerBox" onSubmit={handleRegisterClick}>
                        <div className="dividedDivs">
                            <input autoComplete="off"
                                type="text"
                                placeholder="First Name"
                                required
                                ref={fname}
                                className="registerInput" />
                            <input autoComplete="off"
                                type="text"
                                placeholder="Last Name"
                                required
                                ref={lname}
                                className="registerInput" />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            ref={email}
                            className="registerInput" />
                        <div className="dividedDivs">
                            <input
                                type="text"
                                placeholder="City"
                                required
                                ref={city}
                                className="registerInput" />
                            <input
                                type="text"
                                placeholder="From"
                                required
                                ref={from}
                                className="registerInput" />
                        </div>
                        <select name="relationship" id="relationship" ref={relationship} required
                            selected className="registerInput" placeholder="select your relationship">
                            <option value="0" disabled>-- Select your Relationship --</option>
                            <option value="1">Engaged</option>
                            <option value="2">Single</option>
                            <option value="3">It's Complicated</option>
                        </select>
                        <div className="dividedDivs">
                            <span className="passwordField">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    ref={password}
                                    className="registerInput passwordInput"
                                    minLength={6}
                                    onFocus={handleEyeIcon}
                                />
                                {
                                    eyeVisible ?
                                        passwordVisible ?
                                            <VisibilityOffIcon className="visibleIcon" onClick={passwordVisibility} />
                                            :
                                            <VisibilityIcon className="visibleIcon" onClick={passwordVisibility} /> : ""
                                }
                            </span>
                            <span className="passwordField" >
                                <input
                                    type="password"
                                    placeholder="Confirmation Password"
                                    required
                                    ref={confirmationPassword}
                                    className="registerInput passwordInput"
                                    onFocus={handleEyeIcon}
                                />
                                {
                                    eyeVisible ?
                                        confirmationPasswordVisible ?
                                            <VisibilityOffIcon className="visibleIcon" onClick={passwordConfirmatonVisibility} />
                                            :
                                            <VisibilityIcon className="visibleIcon" onClick={passwordConfirmatonVisibility} /> : ""
                                }
                            </span>
                        </div>
                        <textarea
                            type="text"
                            placeholder="Tell Us more about Yourself"
                            required
                            ref={desc}
                            className="registerInput"
                            maxLength={50}
                        />

                        <button className="registerBtn" type="submit">
                            {isFetching ?
                                <CircularProgress color="inherit" size="25px" />
                                : "Sign Up"}</button>
                        <button className="registerRegisterBtn" onClick={handleLoginClick}>
                            {isFetching ?
                                <CircularProgress color="inherit" size="25px" />
                                : "Log Into your Account"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}



export default Register
