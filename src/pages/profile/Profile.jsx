import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"
import { useState, useEffect, useContext, useRef } from "react"
import { useParams } from "react-router";
import { Edit, Star } from '@mui/icons-material'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useSnackbar } from 'notistack';




import "./profile.css"
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext"



function Profile() {
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
    const { enqueueSnackbar } = useSnackbar();


    const editDesc = useRef();
    const [openedDescEdit, setOpenedDescEdit] = useState(false);
    const username = useParams().username;
    const [user, setUser] = useState({})
    const [option, setOption] = useState("feed");
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${HOST}/users?username=${username}`)
            setUser(res.data);
        };
        setOpenedDescEdit(false);
        fetchUser();
    }, [username]);
    const [userDesc, setUserDesc] = useState(user.desc);


    useEffect(() => {
        setUserDesc(user.desc)
    }, [user])
    const handleOptionClick = (option) => {
        setOption(option)
    }
    const openEditDesc = () => {
        setOpenedDescEdit(true);
    }

    const handleCancelDescEdit = () => {
        setOpenedDescEdit(false);
    }

    const handleDescEdit = async () => {
        try {
            await axios.put(HOST + "/users/updateDesc/" + user._id, { desc: editDesc.current.value.trim() !== "" ? editDesc.current.value.trim() : user.desc });
            enqueueSnackbar("Description Updated Successfully!", { variant: "success" })
            setOpenedDescEdit(false);
            setUserDesc(editDesc.current.value.trim());

        } catch (err) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }




    return (
        <>
            <Topbar profile={true} />
            <div className="profile">

                <Sidebar />

                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={user.coverPicture ? `${PF + user.coverPicture}` : PF + "cover/No_Cover.jpg"} alt="" className="profileCoverImg" loading="lazy" />
                            <img src={user.profilePicture ? `${PF + user.profilePicture}` : PF + "person/noProfile.png"} alt="" className="profileUserImg" loading="lazy" />
                        </div>

                        <div className="profileInfo">
                            <div className="profileName">
                                <h4 className="profileInfoName">{user.name}
                                </h4>
                                {user.isAdmin &&
                                    <span title="Verified Badge">
                                        <Star htmlColor="#1877f2" className="verifiedBadge" />
                                    </span>

                                }
                            </div>
                            {
                                !openedDescEdit ?
                                    <div className="profileInfoDesc">

                                        {userDesc}
                                        {
                                            user?._id === currentUser?._id &&
                                            <Edit style={{ fontSize: "15px", marginLeft: "10px", cursor: "pointer" }} onClick={openEditDesc} />
                                        }
                                    </div>
                                    :
                                    user?._id === currentUser?._id &&

                                    <div className="editDescDiv" >
                                        <input type="text" className="editDescInput"
                                            autoFocus
                                            placeholder={userDesc} ref={editDesc} />
                                        <CheckCircleRoundedIcon htmlColor="green" onClick={handleDescEdit}
                                            style={{ fontSize: smallWindow && "1.5rem", margin: smallWindow && "5px" }} />
                                        <CancelRoundedIcon htmlColor="red" onClick={handleCancelDescEdit}
                                            style={{ fontSize: smallWindow && "1.5rem", margin: smallWindow && "5px" }} />
                                    </div>

                            }
                        </div>


                    </div>

                    <div className="profileOptions">

                        <span className="links" onClick={() => handleOptionClick("feed")}>Feed</span>
                        <span className="links" onClick={() => handleOptionClick("personalInfo")}>Personal Information</span>
                    </div>
                    <div className="profileRightBottom">


                        {

                            !smallWindow ?
                                (
                                    <>
                                        <Feed username={username} />
                                        <Rightbar user={user} />
                                    </>
                                )
                                : option === "feed" ?
                                    <Feed username={username} />
                                    :
                                    <Rightbar user={user} />
                        }




                    </div>

                </div>
            </div>

        </>
    )

}


export default Profile
