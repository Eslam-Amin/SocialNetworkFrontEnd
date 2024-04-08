import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext';
import { Add, Remove, Logout, Edit } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import "./rightbar.css"
import Loader from "../loader/Loader";



const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
const PF = "https://social-media-network.netlify.app/assets/";


function ProfileRightbar({ user }) {
    const [friends, setFriends] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const { user: currentUser, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [followed, setFollowed] = useState(currentUser.followings?.includes(user?._id));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await axios.get(HOST + "/users/friends/" + user?._id);
                setFriends(res.data);
                let flag = res.data.filter((friend) =>
                    friend._id === currentUser._id)
                flag.length === 0 ? setFollowed(false) : setFollowed(true)
            } catch (err) {
                console.log(err)
            }
        }
        getFriends();
    }, [currentUser._id, user?._id]);


    const handleFollowClick = async () => {
        try {
            setIsLoading(true);
            let updatedUser = "";
            if (followed) {
                updatedUser = await axios.put(HOST + "/users/" + user._id + "/unfollow", { userId: currentUser._id });
                dispatch({ type: "UPDATE_USER", payload: updatedUser.data.updatedUser });
                setFriends(friends => friends.filter(friend => friend._id !== currentUser._id));
            }
            else {
                updatedUser = await axios.put(HOST + "/users/" + user._id + "/follow", { userId: currentUser._id });
                dispatch({ type: "UPDATE_USER", payload: updatedUser.data.updatedUser });
                setFriends(friends => [...friends, currentUser]);
            }
            localStorage.setItem("user", JSON.stringify(updatedUser.data.updatedUser));
            setFollowed(followed => !followed);
            setIsLoading(false);
        } catch (err) {
            enqueueSnackbar(followed ? "User Already Followed" : "User Already Unfollowed", { variant: "info" })
        }
    };

    const handleLogOutClick = (e) => {
        localStorage.clear();
        navigate("/")
        window.location.reload();
    }

    const gotoUpdate = () => {
        navigate("/update_user_info/" + currentUser.username)
    }

    return (
        <div className="rightBar">
            <div className="rightBarWrapper">
                <div className="dividedDivsInRightbar">
                    {user?.username !== currentUser.username ?
                        <button className="rightbarFollowBtn" onClick={handleFollowClick}>
                            {
                                isLoading ? <Loader /> :
                                    <>
                                        {followed ? "Unfollow" : "Follow"}
                                        {followed ? <Remove /> : <Add />}
                                    </>
                            }

                        </button>
                        :
                        <button className="rightbarLogoutBtn" onClick={handleLogOutClick}>
                            Logout <Logout />
                        </button>
                    }
                    <h4 className="rightbarTitle">User Information
                        {user?._id === currentUser?._id &&
                            <Edit style={{ fontSize: "15px", marginLeft: "10px", cursor: "pointer" }} onClick={gotoUpdate} />
                        }

                    </h4>
                </div >
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Gender:</span>
                        <span className="rightbarInfoValue">{user.gender}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship === 2 ? "Single" : user.relationship === 1 ? "Engaged" : "It's Complicated"}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User Friends</h4>

                <div className="rightbarFollowings">

                    {
                        friends.map((friend) => (
                            <Link to={"/" + friend.username} key={friend._id} style={{ textDecoration: "none", color: "black" }}>

                                <div className="rightbarFollowing" >
                                    <img loading="lazy" src={friend.profilePicture ? `${PF + friend.profilePicture}` : `${PF}avatars/${friend.gender}.png`} alt="" className="rightbarFollowingImg" />
                                    <span className="rightbarFollowingName">{friend.name}</span>
                                </div>
                            </Link>
                        ))
                    }


                </div >
            </div>
        </div >
    )


}

export default ProfileRightbar
