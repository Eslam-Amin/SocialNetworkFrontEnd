import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import { useContext, useEffect, useState } from "react";
import axios from "../../axios.js";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../loader/Loader";
import PeopleToFollow from "../people you may follow/PeopleToFollow.jsx";
import { useSnackbar } from 'notistack';
import { jsonHeader } from "../../global-links"


function Feed({ username, name }) {

    const { enqueueSnackbar } = useSnackbar();


    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [circleProgress, setCircleProgress] = useState(true);
    const [page, setPage] = useState(2)
    const [contentOver, setContentOver] = useState(false);
    const [moreProgressLoader, setMoreProgressLoader] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const fetchPosts = async () => {
            try {
                setCircleProgress(true);

                const api = username ? "/posts/profile/" + username : "/posts/timeline/"
                const res = await axios.get(api, { signal: controller.signal });
                if (res.data.status === "success")
                    setPosts(res.data.posts);

                setCircleProgress(false);
                // setContentOver(posts?.length === 0)
            } catch (error) {
                // console.log(error.response?.data.message)
                setCircleProgress(true);
                if (error.message !== "canceled" &&
                    (error.response?.data.status === "fail" || error.response?.data.status === "error")) {
                    enqueueSnackbar(error.response?.data.message, { variant: "info" })
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000)
                }
            }
        };
        fetchPosts();
        return function () {
            controller.abort();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id, username])

    const updatedFeed = async () => {
        const api = "/posts/timeline/";
        const res = await axios.get(api);
        setPosts(res.data.posts)
    }

    const addPostAndUpdateFeed = ({ post }) => {
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
        try {

            const api = username ? "/posts/profile/" + username + "?page=" + page
                : "/posts/timeline?page=" + page
            const res = await axios.get(api, { signal: controller.signal });

            if (res.data.status === "success" && res.data.posts.length > 0) {
                setPosts(posts => [...posts, ...res.data.posts]);
                setPage(page => page + 1);
            }
            else
                setContentOver(true)
        }
        catch (err) {
            setContentOver(true)
            console.log(err, ", in Feed Load more Posts")
        }
        finally {
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
                            <Post post={p} user={p.user} key={p?._id}
                                updatedFeed={updatedFeed}
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
                                        <span className="moreFeedBtn rightbarInfoValue noPostsSpan" >No More Posts To Show</span>
                                    </button>
                                    :
                                    posts?.length > 0 && Array.isArray(posts) ?
                                        <button onClick={loadMorePosts} className="feedBtn moreFeedBtn">
                                            <span className="rightbarInfoValue">Load more</span>
                                        </button>
                                        :
                                        user.username === username ?
                                            <span className="moreFeedBtn rightbarInfoValue">you haven't share any Post</span>
                                            :
                                            <div className="peopleYouMayFollow">
                                                {
                                                    name ?
                                                        <span className="moreFeedBtn rightbarInfoValue" >
                                                            {
                                                                name?.split(' ')[0] + " hasn't share any Post"
                                                            }
                                                        </span>
                                                        :
                                                        <PeopleToFollow onUpdateFeed={updatedFeed} />
                                                }
                                            </div>

                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Feed
