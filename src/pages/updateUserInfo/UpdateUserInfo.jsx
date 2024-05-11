import "./updateUserInfo.css";
import axios from "../../axios";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Topbar from "../../components/topbar/Topbar";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/loader/Loader";

function UpdateUserInfo() {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const { user, dispatch } = useContext(AuthContext);

    const city = useRef()
    const from = useRef()
    const relationship = useRef()
    const gender = useRef()
    const password = useRef()
    const smallWindow = window.matchMedia("(max-width:480px)").matches;


    const goBack = () => {
        navigate("/" + user?.username);
    }


    const saveData = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const updatedUserData = {
                city: city.current.value !== "" ? city.current.value : user.city,
                from: from.current?.value !== "" ? from.current.value : user.from,
                relationship: relationship.current.value !== "0" ? relationship.current.value : user.relationship,
                gender: gender.current.value !== "0" ? gender.current.value : user.gender,
                password: password.current.value
            }
            const res = await axios.put("/users/" + user._id, { ...updatedUserData, userId: user._id }, { headers });
            // console.log(res.data)
            //dispatch("UPDATE_USER", res.data.updatedUser);
            dispatch({ type: "UPDATE_USER", payload: res.data.updatedUser });
            // localStorage.setItem("user", JSON.stringify(res.data.updatedUser))
            enqueueSnackbar("user Data Is Updated Successfully", { variant: "success" })

            navigate("/" + user?.username);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            enqueueSnackbar(error.response.data.message, { variant: "error" })
        }
    }
    return (
        <>
            <Topbar />
            <div className="updateWrapper">
                <div className="middle">
                    <form className="updateFormDiv" style={{ width: smallWindow && "90%" }}>
                        <input type="text" placeholder={user.city} className="updateUserInput" ref={city} />

                        <input type="text" placeholder={user.from} className="updateUserInput" ref={from} />

                        <select name="gender" id="gender"
                            className="updateUserInput" placeholder="select your Gender"
                            ref={gender} >
                            <option value="0" selected disabled>-- Select your gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select name="relationship" id="relationship"
                            className="updateUserInput" placeholder="select your relationship"
                            ref={relationship} >
                            <option value="0" selected disabled>-- Select your Relationship --</option>
                            <option value="single">Single</option>
                            <option value="engaged">Engaged</option>
                            <option value="married">Married</option>
                            <option value="other">It's Complicated</option>
                        </select>
                        <input type="password" placeholder="password" className="updateUserInput" ref={password} />

                        <div className="dividedDivs">


                            <button className="shareBtn btn" disabled={loading} onClick={saveData}>
                                {
                                    loading ?
                                        <Loader />
                                        :
                                        "Save"
                                }
                            </button>
                            <button className="cancelBtn btn" disabled={loading} onClick={goBack}> {
                                loading ?
                                    <Loader />
                                    :
                                    "Cancel"
                            }
                            </button>

                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default UpdateUserInfo
