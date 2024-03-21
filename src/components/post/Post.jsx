import "./post.css"
import { MoreVert, Star } from '@mui/icons-material';
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js"
import { Link } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext';
import PostLikes from "../post Likes/PostLikes";
import PostEdit from "../post Edit/PostEdit";
import { useSnackbar } from 'notistack';




function Post({ post, refreshFeed }) {
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";
    const smallWindow = window.matchMedia("(max-width:480px)").matches;


    const { enqueueSnackbar } = useSnackbar();

    const [like, setLike] = useState(post.likes.length);
    const { user: currentUser } = useContext(AuthContext);
    const [menuOpened, setMenuOpened] = useState(false);
    const [postLikesOpened, setPostLikesOpened] = useState(false);
    const [user, setUser] = useState({})
    const [postUsersLikes, setpostUsersLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
    const [editFlagClicked, setEditFlagClicked] = useState(false);

    let menuRef = useRef();
    let postLikesRef = useRef();
    let postEditRef = useRef();

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes])

    const likeHandler = async () => {
        try {
            await axios.put(HOST + "/posts/" + post._id + "/like", { userId: currentUser._id })
            setLike(isLiked ? like - 1 : like + 1)

        } catch (err) {

        }
        console.log(isLiked);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${HOST}/users?userId=${post.userId}`)
            setUser(res.data);
        };
        fetchUser();
    }, [post.userId])



    useEffect(() => {
        const closeOutSide = (e) => {
            if (!menuRef.current.contains(e.target))
                setMenuOpened(false);

        };
        document.addEventListener("click", closeOutSide)
        return () => {
            document.removeEventListener("click", closeOutSide);
        }
    })


    useEffect(() => {
        const closeOutSide = (e) => {
            if (!postLikesRef.current?.contains(e.target))
                setPostLikesOpened(false);

        };
        document.addEventListener("click", closeOutSide)
        return () => {
            document.removeEventListener("click", closeOutSide);
        }
    })


    const handleMoreVert = (e) => {
        //e.preventDefault();
        setMenuOpened(!menuOpened);

    }



    const getPostLikes = async () => {

        try {
            const postLikes = (await axios.get(HOST + "/posts/postLikes/" + post._id));
            setpostUsersLikes(postLikes.data)
            setPostLikesOpened(true);
        }
        catch (err) {
            console.log(err)
        }
    };

    const handleDeletePost = async (e) => {
        if (post.userId === currentUser._id) {
            try {
                await axios.delete(`${HOST}/posts/${post._id}`, { data: { userId: currentUser._id } });
                enqueueSnackbar("post Deleted Successfully! ", { variant: "success" })
                refreshFeed();
            } catch (err) {
                enqueueSnackbar(err.response.data, { variant: 'error' });
                window.location.reload();
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
            setEditFlagClicked(!editFlagClicked);
            setMenuOpened(false)

        }
        else {
            enqueueSnackbar("you can only edit your posts", { variant: 'error' });
        }
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/${user.username}`} className="linkClass">
                            <img loading="lazy" src={PF + "/" + user.profilePicture || PF + "person/noProfile.png"} className="postProfileImg" alt="" />
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

                            /*<DropdownMenu post={post} />*/
                            <div className="dropdownProfile">
                                <ul className="moreList">
                                    <li onClick={handleEditPost}>Edit</li>
                                    <hr />
                                    <li onClick={handleDeletePost}>Delete</li>

                                </ul>

                            </div>}
                    </div>
                </div>
                <div className="postCenter">
                    {
                        editFlagClicked &&
                        <span ref={postEditRef}>
                            <PostEdit post={post} cancelPostEdit={cancelPostEdit} user={currentUser} refreshFeed={refreshFeed} />
                        </span>

                    }

                    <span className="postText">{post?.content} </span>
                    {post.img ?
                        <img className="postImg" src={PF + post?.img} alt="" /> : ""
                    }

                    {
                        postLikesOpened ?
                            <div ref={postLikesRef}>
                                <PostLikes postUsersLikes={postUsersLikes} />
                            </div> : ""
                    }
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        {
                            isLiked ?
                                <img className="reactIcon" src={`${PF}liked.png`} alt="" onClick={likeHandler} />
                                :
                                <img className="reactIcon" src={`${PF}like.png`} alt="" onClick={likeHandler} />
                        }
                        {/*<img className="reactIcon" src={`${PF}heart.png`} alt="" onClick={likeHandler} />*/}
                        <span className="postReactCounter" onClick={getPostLikes}>{like} People Like it</span>

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
