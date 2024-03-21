import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";


function Feed({ username }) {
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";

    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [circleProgress, setCircleProgress] = useState(true);
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const api = username ? HOST + "/posts/profile/" + username : HOST + "/posts/timeline/" + user._id
                const res = await axios.get(api);
                setPosts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setCircleProgress(false);

            } catch (error) {
                setCircleProgress(true);
            }
        };
        fetchPosts();
    }, [user._id, username, reducerValue])

    const refreshFeed = () => {
        forceUpdate();
    }

    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share refreshFeed={refreshFeed} />}

                {
                    circleProgress ?
                        <span className="progress">
                            <CircularProgress color="inherit" size="25px" />
                        </span>
                        :
                        posts?.map((p) => (
                            <Post post={p} key={p._id} refreshFeed={refreshFeed} />
                        ))
                }
                {/*posts.map((p) => (
                    <Post post={p} key={p._id} />
                ))*/}

            </div>
        </div >
    )
}

export default Feed
