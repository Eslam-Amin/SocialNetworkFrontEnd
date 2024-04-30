import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import { useContext, useEffect, useState } from "react";
import axios from "../../axios.js";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../loader/Loader";


function Feed({ username, name }) {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [circleProgress, setCircleProgress] = useState(true);
    const [page, setPage] = useState(2)
    const [contentOver, setContentOver] = useState(false);
    const [moreProgressLoader, setMoreProgressLoader] = useState(false);

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };


    useEffect(() => {
        const controller = new AbortController();
        const fetchPosts = async () => {
            try {
                setCircleProgress(true);

                const api = username ? "/posts/profile/" + username : "/posts/timeline/" + user._id
                const res = await axios.get(api, { signal: controller.signal, headers });
                if (res.data.status === "success")
                    setPosts(res.data.posts);

                setCircleProgress(false);
            } catch (error) {
                setCircleProgress(true);
            }
        };
        fetchPosts();
        return function () {
            controller.abort();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id, username])

    const addPostAndUpdateFeed = (post) => {
        setPosts(posts => [...posts, post].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    }

    const deletePostAndUpdateFeed = (postId) => {
        setPosts(posts => posts.filter(post => post._id !== postId));
    }

    const editPostAndUpdateFeed = (post, newContent) => {
        const requiredPost = posts.find(p => p._id === post._id)
        requiredPost.content = newContent;
        setPosts(posts => [...posts]);
    }

    const loadMorePosts = async () => {
        const controller = new AbortController();
        setMoreProgressLoader(true)
        const api = username ? "/posts/profile/" + username + "?page=" + page : "/posts/timeline/" + user._id + "?page=" + page
        const res = await axios.get(api, { signal: controller.signal, headers });
        if (res.data.status === "success" && res.data.posts.length > 0) {
            setPosts(posts => [...posts, ...res.data.posts]);
            setMoreProgressLoader(false)
            setPage(page => page + 1);
        } else {
            setContentOver(true)
            setMoreProgressLoader(false)
        }
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
                            <Post post={p} key={p?._id}
                                deletePostAndUpdateFeed={deletePostAndUpdateFeed}
                                editPostAndUpdateFeed={editPostAndUpdateFeed} />
                        ))

                }
                {
                    !circleProgress &&

                    <div className="more" >
                        {
                            moreProgressLoader ?
                                <Loader cName="moreProgress" />
                                :
                                contentOver ?
                                    <button disabled className="feedBtn noPostsSpan">
                                        <span >No more Posts To Show</span>
                                    </button>
                                    :
                                    posts.length !== 0 ?
                                        <button onClick={loadMorePosts} className="feedBtn moreFeedBtn">
                                            <span>Load more</span>
                                        </button>
                                        :
                                        user.username === username ?
                                            <span className="noPostsSpan">you haven't share any Post</span>
                                            :
                                            <span className="noPostsSpan">
                                                {
                                                    name ?
                                                        name?.split(' ')[0] + " hasn't share any Post"
                                                        :
                                                        "there are no posts to show"
                                                }
                                            </span>

                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Feed
