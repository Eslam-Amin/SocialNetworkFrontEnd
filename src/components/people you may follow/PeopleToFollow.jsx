import "./peopleToFollow.css"
import axios from "../../axios"

import { useState, useEffect } from 'react';

import FollowingIndvidiual from "./FollowingIndvidiual";
import Loader from "../loader/Loader";

function PeopleToFollow({ onUpdateFeed }) {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        const controller = new AbortController();

        const getTopUsers = async () => {
            try {
                const res = await axios.get("/users/top-5-users", { signal: controller.signal, headers })
                setLoading(false)
                setUsers(res.data.users)
            }
            catch (err) {
                console.log(err)
            }
        }

        getTopUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="peopleToFollowWrapper">
            <h3 className="rightbarInfoValue">People You May Follow</h3>
            {
                loading ?
                    <Loader />
                    :
                    users?.map((user, index) => (
                        <FollowingIndvidiual
                            user={user}
                            onUpdateFeed={onUpdateFeed}
                            key={user._id}
                            headers={headers}
                        />
                    ))
            }
        </div>
    )
}

export default PeopleToFollow
