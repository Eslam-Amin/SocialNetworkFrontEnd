import { useRef, useState } from "react";
import { useSnackbar } from 'notistack';
import "./register.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { HOST } from "../../global-links"

function Register() {

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
    const gender = useRef();
    const [isFetching, setIsfetching] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmationPasswordVisible, setconfirmationPasswordVisible] = useState(false);
    const [eyeVisible, setEyeVisible] = useState(false);


    const navigate = useNavigate();

    const getUsernameFromNameEntry = (fname, lname) => {
        const username = fname.charAt(0).toUpperCase() + fname.slice(1).trim().toLowerCase()
            + lname.charAt(0).toUpperCase() + lname.slice(1).trim().toLowerCase();
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
            if (gender.current.value === 0 || relationship.current.value === 0)
                enqueueSnackbar("Something Wrong With the form", { variant: 'error' });

            const user = {
                name: uname,
                username: getUsernameFromNameEntry(fname.current.value, lname.current.value),
                email: email.current.value,
                relationship: relationship.current.value,
                gender: gender.current.value,
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

    const changePasswordVisibility = () => {
        if (password.current.type === "password") {
            password.current.type = "text";
        }
        else {
            password.current.type = "password";
        }

        setPasswordVisible(passwordVisibility => !passwordVisibility)
    }
    const passwordConfirmatonVisibility = () => {
        if (confirmationPassword.current.type === "password")
            confirmationPassword.current.type = "text";

        else
            confirmationPassword.current.type = "password";


        setconfirmationPasswordVisible(!confirmationPasswordVisible)
    }


    const handleLoginClick = () => {
        navigate("/login");
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
                        <div className="dividedDivs-register">
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
                        <div className="dividedDivs-register">
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
                        <select name="gender" id="gender" ref={gender} required
                            className="registerInput" placeholder="select your gender">
                            <option selected disabled value="0">-- Select your gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select
                            name="relationship" id="relationship" ref={relationship} required
                            className="registerInput" placeholder="select your relationship">
                            <option selected disabled value="0">-- Select your Relationship --</option>
                            <option value="single">Single</option>
                            <option value="engaged">Engaged</option>
                            <option value="married">Married</option>
                            <option value="other">It's Complicated</option>
                        </select>

                        <div className="dividedDivs-register">
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
                                    eyeVisible &&
                                        passwordVisible ?
                                        <VisibilityOffIcon className="visibleIcon" onClick={changePasswordVisibility} />
                                        :
                                        <VisibilityIcon className="visibleIcon" onClick={changePasswordVisibility} />
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
                            Log Into your Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}



export default Register
