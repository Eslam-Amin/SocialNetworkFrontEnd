import "./profile.css"
import { useState, useEffect } from "react"
import { useParams } from "react-router";

import axios from "../../axios.js";

import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"

import NotFound from "../../components/404 Component/notFound"
import ProfileTop from "./profileTop";



import { HOST } from "../../global-links"
import Loader from "../../components/loader/Loader";

function Profile() {

    const [openedDescEdit, setOpenedDescEdit] = useState(false);
    const username = useParams().username;
    const [user, setUser] = useState({ name: "" })
    const [option, setOption] = useState("feed");
    const [isUserFound, setIsUserFound] = useState(true);
    const [loading, setLoading] = useState(false);
    const smallWindow = window.matchMedia("(max-width:480px)").matches;

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/users?username=${username}`, { headers })

                // .then(res => setUser(res.data.user))
                // .catch(err => new Error("error"))
                setUser(res.data.user)
                setOption("feed")
                setLoading(false)
                setIsUserFound(true);

            }
            catch (err) {
                setLoading(false)
                setIsUserFound(false);
                console.log(err.response.data);
            }
        };
        setOpenedDescEdit(false);
        fetchUser();
    }, [username]);


    useEffect(() => {

        if (!isUserFound)
            document.title = "404 User not Found!"
        else
            document.title = "Profile | " + user.name
        return () => document.title = "Social Network"
    }, [isUserFound, user.name])

    const handleOptionClick = (option) => {
        setOption(option)
    }

    // const openEditDesc = () => {
    //     setOpenedDescEdit(true);
    // }

    // const handleCancelDescEdit = () => {
    //     setOpenedDescEdit(false);
    // }

    // const handleDescEdit = async () => {
    //     try {
    //         const res = await axios.put(HOST + "/users/updateDesc/" + user._id, { desc: editDescRef.current.value.trim() !== "" ? editDescRef.current.value.trim() : user.desc });
    //         enqueueSnackbar("Description Updated Successfully!", { variant: "success" })
    //         setOpenedDescEdit(false);
    //         setUserDesc(editDescRef.current.value.trim());
    //         dispatch({ type: "UPDATE_USER", payload: res.data.updatedUser });
    //         localStorage.setItem("user", JSON.stringify(res.data.updatedUser))

    //     } catch (err) {
    //         enqueueSnackbar(err, { variant: "error" })
    //     }
    // }

    return (
        <>
            <Topbar profile={true} />
            {
                loading ?
                    <div className="loadingWrapper">

                        <Loader cName="loadingProfileProgress" />
                    </div>
                    :
                    !isUserFound ?
                        <div className="profile">
                            <Sidebar />
                            <NotFound />

                        </div>
                        :
                        <div className="profile">
                            <Sidebar />

                            <div className="profileRight">
                                <ProfileTop
                                    user={user}
                                    smallWindow={smallWindow}
                                />
                                <div className="profileOptions">

                                    <span className="links" onClick={() => handleOptionClick("feed")}>Feed</span>
                                    <span className="links" onClick={() => handleOptionClick("personalInfo")}>Personal Information</span>
                                </div>
                                <div className="profileRightBottom">

                                    {

                                        !smallWindow ?
                                            (
                                                <>
                                                    <Feed username={user.username} name={user.name} />
                                                    <Rightbar user={user} />
                                                </>
                                            )
                                            : option === "feed" ?
                                                <Feed username={user.username} name={user.name} />
                                                :
                                                <Rightbar user={user} />
                                    }




                                </div>

                            </div>
                        </div>

            }

        </>
    )


}


export default Profile
