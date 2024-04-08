import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../loader/Loader";


const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
function Feed({ username }) {

    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [circleProgress, setCircleProgress] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchPosts = async () => {
            try {
                const api = username ? HOST + "/posts/profile/" + username : HOST + "/posts/timeline/" + user._id
                const res = await axios.get(api, { signal: controller.signal });
                setPosts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setCircleProgress(false);
            } catch (error) {
                setCircleProgress(true);
            }
        };
        fetchPosts();
        return function () {
            controller.abort();
        }
    }, [user._id, username])

    const addPostAndUpdateFeed = (post) => {
        console.log(post);
        setPosts(posts => [...posts, post].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    const deletePostAndUpdateFeed = (postId) => {
        setPosts(posts => posts.filter(post => post._id !== postId));
    }

    const editPostAndUpdateFeed = (post, newContent) => {
        const p = posts.filter(p => p._id === post._id)[0];
        p.content = newContent;
        setPosts(posts => [...posts]);
    }

    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) &&
                    <Share
                        addPostAndUpdateFeed={addPostAndUpdateFeed} />}

                {
                    circleProgress ?
                        <Loader cName="progress" />
                        :
                        posts?.map((p) => (
                            <Post post={p} key={p._id}
                                deletePostAndUpdateFeed={deletePostAndUpdateFeed}
                                editPostAndUpdateFeed={editPostAndUpdateFeed} />
                        ))
                }
            </div>
        </div>
    )
}

export default Feed
