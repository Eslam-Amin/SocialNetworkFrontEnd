import Online from "../Online/Online"
import Advertisement from '../advertisement/Advertisement';
import { Users } from './../../dummyData';
import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext';
import { Add, Remove, Logout } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import "./rightbar.css"


function Rightbar({ user }) {


    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    const { enqueueSnackbar } = useSnackbar();

    const HomeRightbar = () => {
        return (
            <>
                <Advertisement />
                <img loading="lazy" src={`${PF}ad.png`} alt="" className="rightBarAd" />
                <h4 className="rightBarTitle">Online Friends</h4>
                <ul className="rightBarFriendList">
                    {
                        Users.map((u) => (
                            <Online key={u.id} user={u} />
                        ))
                    }
                </ul>
            </>)
    };

    const ProfileRightbar = () => {
        const [friends, setFriends] = useState([]);

        const { user: currentUser, dispatch } = useContext(AuthContext);
        const navigate = useNavigate();
        const [followed, setFollowed] = useState(currentUser.followings?.includes(user?._id));




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
        }, []);




        const handleFollowClick = async () => {
            try {
                if (followed) {
                    const updatedUser = await axios.put(HOST + "/users/" + user._id + "/unfollow", { userId: currentUser._id });
                    dispatch({ type: "UPDATE_USER", payload: updatedUser.data.updatedUser });
                }
                else {
                    const updatedUser = await axios.put(HOST + "/users/" + user._id + "/follow", { userId: currentUser._id });
                    dispatch({ type: "UPDATE_USER", payload: updatedUser.data.updatedUser });
                }
                setFollowed(!followed)
            } catch (err) {
                enqueueSnackbar("User Already " + followed ? "Followed" : "Unfollowed", { variant: "info" })
                console.log(err + " in HandleFollowClick in rightbar line 42 ")
            }
        };


        const handleLogOutClick = (e) => {
            localStorage.clear();
            navigate("/")
            window.location.reload();
        }


        return (
            <>
                <div className="dividedDivsInRightbar">
                    {user?.username !== currentUser.username ?
                        <button className="rightbarFollowBtn" onClick={handleFollowClick}>
                            {followed ? "Unfollow" : "Follow"}
                            {followed ? <Remove /> : <Add />}
                        </button>
                        :
                        <button className="rightbarLogoutBtn" onClick={handleLogOutClick}>
                            Logout <Logout />
                        </button>
                    }
                    <h4 className="rightbarTitle">User Information</h4>

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
                                    <img loading="lazy" src={friend.profilePicture ? `${PF + friend.profilePicture}` : `${PF}/person/noProfile.png`} alt="" className="rightbarFollowingImg" />
                                    <span className="rightbarFollowingName">{friend.name}</span>
                                </div>
                            </Link>
                        ))
                    }


                </div >
            </>
        )
    }
    return (

        <>
            <>
                {
                    smallWindow ?
                        (
                            user ?
                                (
                                    <div className="rightBar">
                                        <div className="rightBarWrapper">
                                            <ProfileRightbar />
                                        </div>
                                    </div>
                                )
                                :
                                ""
                        )
                        :
                        (
                            user ?
                                (
                                    <div className="rightBar">
                                        <div className="rightBarWrapper">
                                            <ProfileRightbar />
                                        </div>
                                    </div>
                                ) :
                                <div className="rightBar">
                                    <div className="rightBarWrapper">
                                        <HomeRightbar />
                                    </div>
                                </div>
                        )
                }
            </>




        </>)
}

export default Rightbar
