import "./post.css"
import { MoreVert, Star } from '@mui/icons-material';
import { useState, useEffect, useContext, useRef } from "react";
import axios from "../../axios.js";
import { format } from "timeago.js"
import { Link } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext';
import PostLikes from "../post Likes/PostLikes";
import Comments from "../comments/Comments";
import CommentInput from "../comments/CommentInput";
import PostEdit from "../post Edit/PostEdit";
import { useSnackbar } from 'notistack';
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Loader from "../loader/Loader";

import { HOST, PF } from "../../global-links"
import { jsonHeader } from "../../global-links"


function Post({ post, deletePostAndUpdateFeed, updatedFeed, editPostAndUpdateFeed, user }) {
    const smallWindow = window.matchMedia("(max-width:480px)").matches;

    const { enqueueSnackbar } = useSnackbar();

    const [like, setLike] = useState(post.numOfLikes);
    const { user: currentUser } = useContext(AuthContext);
    const [menuOpened, setMenuOpened] = useState(false);

    const [postLikesOpened, setPostLikesOpened] = useState(false);
    const [postCommentsOpened, setPostCommentsOpened] = useState(false);
    const [postComments, setPostComments] = useState();
    const [postNumOfComments, setPostNumOfComments] = useState(post.numOfComments)
    const [postUsersLikes, setpostUsersLikes] = useState([]);
    const [isLiked, setIsliked] = useState(() => {
        if (post.numOfLikes === 0) return false
        else {
            let liked = post.likes.filter((like) => like.user === currentUser._id)
            return liked.length >= 1
        }
    })
    const [likesLoader, setLikesLoader] = useState(false);
    const [commentsLoader, setCommentsLoader] = useState(false);
    const [editFlagClicked, setEditFlagClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    let menuRef = useRef();
    let newPost = useRef();
    let postLikesRef = useRef();
    let postCommentsRef = useRef();
    let postEditRef = useRef();
    const likeHandler = async () => {
        try {
            setIsLoading(true);
            await axios.post(HOST + "/posts/" + post._id + "/react", { headers: jsonHeader })
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
            setpostUsersLikes(postLikes.data.likes)
            setPostLikesOpened(true);
        }
        catch (err) {
            console.log(err, " in Post getPostLikes")
        }
        finally {
            setLikesLoader(false)
        }
    };

    const getPostComments = async () => {
        try {
            setEditFlagClicked(false)
            setCommentsLoader(true);
            const postCommentsRes = await axios.get(`/posts/${post._id}/comments`);
            setPostComments(postCommentsRes.data.comments);
            setPostCommentsOpened(true);
        } catch (error) {
            console.log(error, " in get postComments")
        } finally {
            setCommentsLoader(false);
        }
    }
    const handleDeletePost = async () => {
        if (post.user._id === currentUser._id) {
            try {
                await axios.delete(`/posts/${post._id} `, { data: { userId: currentUser._id } });
                deletePostAndUpdateFeed(post._id);
                await updatedFeed()
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
        console.log(post.user._id)
        if (post.user._id === currentUser._id) {
            setEditFlagClicked(true);
            setMenuOpened(false)
        }
        else {
            enqueueSnackbar("you can only edit your posts", {
                variant: 'error'
            });
        }
    }

    const editCommentAndUpdateComments = (comment, newComment) => {
        console.log(postComments)
        console.log(newComment)
        const requiredComment = postComments.find(c => c._id === comment._id)
        requiredComment.comment = newComment;
        console.log(requiredComment)
        setPostComments(postComments => [...postComments]);
    }
    const deleteCommentAndUpdateCommentSection = (commentId) => {
        setPostComments(comments => comments.filter(comment => comment._id !== commentId));
        setPostNumOfComments(postNumOfComments => postNumOfComments - 1)
    }

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
    const updateNumberOfComments = () => {
        setPostNumOfComments(postNumOfComments => postNumOfComments + 1)
    }
    const handleCloseComments = () => {
        setPostCommentsOpened(false)
    }


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
        <>
            <div className="post" >
                <div className="postWrapper">
                    <div className="postTop">
                        <div className="postTopLeft">
                            <Link to={`/${user.username}`} className="linkClass">
                                <img loading="lazy" src={user.profilePicture ?
                                    user.profilePicture.startsWith("http") ? user.profilePicture :
                                        PF + user.profilePicture : `${PF}avatars/${user.gender}.png`}
                                    className="postProfileImg" alt="" />
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
                                    sameUser={currentUser._id === post.user._id}
                                    post={post}
                                    onHandleDeletePost={handleDeletePost}
                                    onHandleEditPost={handleEditPost}
                                />

                            }
                        </div>
                    </div>




                    {
                        postCommentsOpened &&
                        <div ref={postLikesRef}>
                            <Comments
                                postComments={postComments}
                                post={post} user={currentUser} handleCloseComments={handleCloseComments}
                                onDeleteComment={deleteCommentAndUpdateCommentSection}
                                onUpdateComment={editCommentAndUpdateComments}
                            />
                        </div>
                    }
                    {
                        postLikesOpened &&
                        <div ref={postCommentsRef}>
                            <PostLikes postUsersLikes={postUsersLikes} />
                        </div>
                    }

                    <div className="postCenter">
                        <>
                            {
                                editFlagClicked ?
                                    <div ref={postEditRef}>
                                        <PostEdit
                                            post={post}
                                            cancelPostEdit={cancelPostEdit}
                                            user={currentUser}
                                            editPostAndUpdateFeed={editPostAndUpdateFeed} />
                                    </div>
                                    :
                                    <span className="postText" >
                                        <>
                                            {post?.content}
                                        </>
                                    </span>
                            }
                        </>
                        {

                            post.img &&
                            <img loading="lazy" src={post?.img ?
                                post?.img.startsWith("http") ? post?.img :
                                    PF + post?.img : `${PF}/${post?.img}`}
                                className="postImg" alt=""
                            />
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
                            {
                                commentsLoader ?
                                    <Loader cName="loader" size="16px" />
                                    :
                                    <span className="postCommentText" onClick={getPostComments}>{postNumOfComments} Comments</span>
                            }
                        </div>


                    </div>
                </div>
            </div>
            <CommentInput
                updateNumberOfComments={updateNumberOfComments}
                user={currentUser} post={post} />

        </>
    )
}

export default Post
