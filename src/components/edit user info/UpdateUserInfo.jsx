import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Topbar from "../topbar/Topbar"

import "./updateUserInfo.css";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

function UpdateUserInfo() {



    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { user, dispatch } = useContext(AuthContext);

    const city = useRef()
    const from = useRef()
    const relationship = useRef()
    const password = useRef()
    const smallWindow = window.matchMedia("(max-width:480px)").matches;


    const goBack = () => {
        navigate("/" + user?.username);
    }


    const saveData = async (e) => {
        e.preventDefault();
        try {

            const updatedUserData = {
                city: city.current.value !== "" ? city.current.value : user.city,
                from: from.current?.value !== "" ? from.current.value : user.from,
                relationship: relationship.current.value !== "0" ? relationship.current.value : user.relationship,
                password: password.current.value
            }
            const res = await axios.put(HOST + "/users/" + user._id, { ...updatedUserData, userId: user._id });

            //dispatch("UPDATE_USER", res.data.updatedUser);
            dispatch({ type: "UPDATE_USER", payload: res.data.updatedUser });
            localStorage.setItem("user", JSON.stringify(res.data.updatedUser))
            enqueueSnackbar("user Data Is Updated Successfully", { variant: "success" })
            navigate("/" + user?.username);

        } catch (error) {
            console.log(error)
            enqueueSnackbar(error, { variant: "error" })
        }
    }
    return (
        <>
            <Topbar />
            <div className="updateWrapper">
                <div className="middle">
                    <form className="updateFormDiv" style={{ width: smallWindow && "90%" }}>
                        <input type="text" placeholder={user.city} className="registerInput" ref={city} />

                        <input type="text" placeholder={user.from} className="registerInput" ref={from} />

                        <select name="relationship" id="relationship"
                            className="registerInput" placeholder="select your relationship"
                            ref={relationship} >
                            <option value="0" selected disabled>-- Select your Relationship --</option>
                            <option value="1">Engaged</option>
                            <option value="2">Single</option>
                            <option value="3">It's Complicated</option>
                        </select>
                        <input type="password" placeholder="password" className="registerInput" ref={password} />

                        <div className="dividedDivs">
                            <button className="shareBtn btn" onClick={saveData}>Save</button>
                            <button className="cancelBtn btn" onClick={goBack}>Cancel</button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default UpdateUserInfo
