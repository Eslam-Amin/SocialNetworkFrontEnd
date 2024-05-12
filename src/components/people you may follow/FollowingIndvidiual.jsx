import axios from "../../axios.js";
import { useState, useContext } from 'react';
import { Star } from '@mui/icons-material';

import { AuthContext } from './../../context/AuthContext';


import { Link } from "react-router-dom";
import { PF } from "../../global-links"
import Loader from "../loader/Loader";

function FollowingIndvidiual({ user, onUpdateFeed, headers }) {
    const [loading, setLoading] = useState(false)
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const smallWindow = window.matchMedia("(max-width:480px)").matches;

    const followUser = async (user) => {
        try {

            setLoading(true)

            const res = await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id })
            dispatch({ type: "UPDATE_USER", payload: res.data.updatedUser });

            onUpdateFeed();
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="peopleToFollowContainer" key={user._id}>
            <Link to={"/" + user.username}
                style={{ textDecoration: "none", color: "black" }}>

                <div className="peopleToFollow" >
                    <img loading="lazy"
                        alt="" className="peopleToFollowImage"
                        src={user.profilePicture ? `${PF + user.profilePicture}` : `${PF}avatars/${user.gender}.png`} />
                    <span className="rightbarFollowingName">
                        {user.name}
                        {user.isAdmin &&
                            <span title="Verified Badge">
                                <Star htmlColor="#1877f2" className="verifiedBadge" style={{ fontSize: smallWindow ? "1rem" : "1.2rem" }} />
                            </span>
                        }
                    </span>
                </div>
            </Link>
            <button className="rightbarFollowBtn"
                onClick={() => followUser(user)}
                key={user._id}
                disabled={loading}
            >
                {
                    loading ?
                        <Loader size="17px" />
                        :
                        "Follow"
                }

            </button>
        </div>
    )
}

export default FollowingIndvidiual
