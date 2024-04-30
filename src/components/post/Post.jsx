import "./post.css"
import { MoreVert, Star } from '@mui/icons-material';
import { useState, useEffect, useContext, useRef } from "react";
import axios from "../../axios.js";
import { format } from "timeago.js"
import { Link } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext';
import PostLikes from "../post Likes/PostLikes";
import PostEdit from "../post Edit/PostEdit";
import { useSnackbar } from 'notistack';
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Loader from "../loader/Loader";

import { HOST, PF } from "../../global-links"


function Post({ post, deletePostAndUpdateFeed, editPostAndUpdateFeed }) {
    const smallWindow = window.matchMedia("(max-width:480px)").matches;

    const { enqueueSnackbar } = useSnackbar();

    const [like, setLike] = useState(post.likes?.length);
    const { user: currentUser } = useContext(AuthContext);
    const [menuOpened, setMenuOpened] = useState(false);
    const [postLikesOpened, setPostLikesOpened] = useState(false);
    const [user, setUser] = useState({})
    const [postUsersLikes, setpostUsersLikes] = useState([]);

    const [isLiked, setIsliked] = useState(post.likes?.includes(currentUser._id));

    const [likesLoader, setLikesLoader] = useState(false);
    const [editFlagClicked, setEditFlagClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
    let menuRef = useRef();
    let postLikesRef = useRef();
    let postEditRef = useRef();

    const likeHandler = async () => {
        try {
            setIsLoading(true);
            await axios.put(HOST + "/posts/" + post._id + "/react", { userId: currentUser._id }, { headers })
            setLike(like => isLiked ? like - 1 : like + 1);
            setIsliked(isLiked => !isLiked);
            setIsLoading(false);
        } catch (err) {

        }
    }

    const cleanUpCloseFunction = (evtName) => {
        document.removeEventListener("click", evtName);
    }

    const handleMoreVert = () => {
        setMenuOpened(!menuOpened);
    }

    const getPostLikes = async () => {
        try {
            setEditFlagClicked(false)
            setLikesLoader(true);
            const postLikes = (await axios.get("/posts/post-likes/" + post._id));
            setpostUsersLikes(postLikes.data.users)
            setPostLikesOpened(true);
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLikesLoader(false)
        }
    };

    const handleDeletePost = async () => {
        if (post.userId === currentUser._id) {
            try {
                deletePostAndUpdateFeed(post._id);
                await axios.delete(`/posts/${post._id} `, { data: { userId: currentUser._id }, headers });
                enqueueSnackbar("post Deleted Successfully! ", { variant: "success" })
            } catch (err) {
                enqueueSnackbar(err.response.data, { variant: 'error' });
            }
        }
        else {
            enqueueSnackbar("you can only delete your posts", { variant: 'error' });
        }
    }

    const cancelPostEdit = () => {
        setEditFlagClicked(false);
    }

    const handleEditPost = () => {
        if (post.userId === currentUser._id) {
            setEditFlagClicked(true);
            setMenuOpened(false)
        }
        else {
            enqueueSnackbar("you can only edit your posts", { variant: 'error' });
        }
    }


    useEffect(() => {
        const controller = new AbortController();

        const fetchUserOfEachPost = async () => {
            if (post.userId === currentUser._id)
                setUser(currentUser)
            const res = await axios.get(`/users?userId=${post.userId}`,
                { signal: controller.signal, headers })
            setUser(res.data.user);
        };
        fetchUserOfEachPost();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.userId])



    useEffect(() => {
        const closeOutSide = (e) => {
            if (!postLikesRef.current?.contains(e.target))
                setPostLikesOpened(false);
        };
        document.addEventListener("click", closeOutSide)
        return () => {
            cleanUpCloseFunction(closeOutSide)
        }
    })

    // useEffect(() => {
    //     const closeOutSide = (e) => {
    //         if (!postEditRef.current?.contains(e.target) && e.target !== "edit")
    //             setEditFlagClicked(false);

    //     }
    //     document.addEventListener("click", closeOutSide);
    //     return () => {
    //         cleanUpCloseFunction(closeOutSide)
    //     }
    // })

    useEffect(() => {
        const closeOutSide = (e) => {
            if (!menuRef.current?.contains(e.target))
                setMenuOpened(false);
        };
        document.addEventListener("click", closeOutSide)
        return () => {
            cleanUpCloseFunction(closeOutSide)
        }
    })

    return (
        <div className="post" >
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/${user.username}`} className="linkClass">
                            <img loading="lazy" src={user.profilePicture ? PF + user.profilePicture : `${PF}avatars/${user.gender}.png`} className="postProfileImg" alt="" />
                            <span className="postUsername">
                                {user.name}
                                {user.isAdmin &&
                                    <span title="Verified Badge">
                                        <Star htmlColor="#1877f2" className="verifiedBadge" style={{ fontSize: smallWindow ? "1rem" : "1.2rem" }} />
                                    </span>

                                }</span>

                        </Link>
                        <span className="postDate">{format(post.createdAt)}</span>

                    </div>
                    <div className="postTopRight" ref={menuRef}>
                        <MoreVert className="postMoreVert" onClick={handleMoreVert} />
                        {menuOpened &&
                            <DropdownMenu
                                sameUser={currentUser._id === post.userId}
                                post={post}
                                onHandleDeletePost={handleDeletePost}
                                onHandleEditPost={handleEditPost}
                            />

                        }
                    </div>
                </div>

                {
                    editFlagClicked &&
                    <div ref={postEditRef}>
                        <PostEdit
                            post={post}
                            cancelPostEdit={cancelPostEdit}
                            user={currentUser}
                            editPostAndUpdateFeed={editPostAndUpdateFeed} />
                    </div>
                }


                {
                    postLikesOpened &&
                    <div ref={postLikesRef}>
                        <PostLikes postUsersLikes={postUsersLikes} />
                    </div>
                }

                <div className="postCenter">
                    <span className="postText">{post?.content} </span>
                    {post.img ?
                        <img className="postImg" src={PF + post?.img} alt="" /> : ""
                    }

                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        {
                            isLoading ?
                                <Loader cName="loader" size="16px" /> :
                                isLiked ?
                                    <img className="reactIcon" src={`${PF}liked.png`} alt="" onClick={likeHandler} />
                                    :
                                    <img className="reactIcon" src={`${PF}like.png`} alt="" onClick={likeHandler} />
                        }
                        {/*<img className="reactIcon" src={`${ PF } heart.png`} alt="" onClick={likeHandler} />*/}
                        {
                            likesLoader ?
                                <Loader cName="loader" size="16px" /> :
                                <span className="postReactCounter" onClick={getPostLikes}>{like} People Like it</span>
                        }

                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} Comments</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Post
