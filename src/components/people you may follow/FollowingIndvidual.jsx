import { useState } from 'react';

import { Link } from "react-router-dom";
import { PF } from "../../global-links"
import Loader from "../loader/Loader";

function FollowingIndvidual({ user, onFollowUser, loading }) {


    return (
        <div className="peopleToFollowContainer" key={user._id}>
            <Link to={"/" + user.username}
                key={user._id}
                style={{ textDecoration: "none", color: "black" }}>

                <div className="peopleToFollow" >
                    <img loading="lazy"
                        alt="" className="peopleToFollowImage"
                        src={user.profilePicture ? `${PF + user.profilePicture}` : `${PF}avatars/${user.gender}.png`} />
                    <span className="rightbarFollowingName">{user.name}</span>
                </div>
            </Link>
            <button className="rightbarFollowBtn"
                onClick={() => onFollowUser(user)}
                key={user._id}
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

export default FollowingIndvidual
