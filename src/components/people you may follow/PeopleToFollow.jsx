import "./peopleToFollow.css"
import axios from "axios"
import { useState, useEffect } from 'react';

import FollowingIndvidiual from "./FollowingIndvidiual";

function PeopleToFollow({ onUpdateFeed }) {
    const [users, setUsers] = useState();
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        const controller = new AbortController();

        const getTopUsers = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/v2/users/top-5-users", { signal: controller.signal, headers })
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
            <h3>People You May Follow</h3>
            {

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
