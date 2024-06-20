import { Link } from "react-router-dom"
import { PF } from "../../global-links"
import { format } from "timeago.js"
import { Star } from '@mui/icons-material';
import Loader from "../loader/Loader";

import "./comments.css"
import axios from "../../axios";
import { useSnackbar } from 'notistack';
import { useState, useRef } from "react";

function Comment({ comment, user, post, onDeleteComment, onUpdateComment }) {
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    const { enqueueSnackbar } = useSnackbar();
    const [editCommentOpened, setEditCommentOpened] = useState(false)
    const content = useRef()
    const [loading, setLoading] = useState(false)

    const handleDeleteComment = async () => {
        try {

            if (comment.user._id === user._id) {
                await axios.delete(`/posts/${post}/comments/${comment._id}`)
                onDeleteComment(comment._id)
                enqueueSnackbar("Comment Deleted Successfully", { variant: "success" })

            }
            else {
                enqueueSnackbar("you can only DELETE your Own Comment", { variant: "error" })
            }
        } catch (error) {
            console.log(error, " in Comments handleDeleteComment")
        }
    }
    const handleEditComment = () => {
        setEditCommentOpened(true)
    }
    const cancelEditComment = () => {
        setEditCommentOpened(false)
    }
    const saveEditComment = async () => {
        if (comment.user._id === user._id) {
            if (content.current.value.trim().length !== 0) {
                try {
                    setLoading(true)
                    await axios.patch(`/posts/${post}/comments/${comment._id}`, { comment: content.current.value.trim() })
                    onUpdateComment(comment, content.current.value.trim())
                    cancelEditComment();
                } catch (error) {
                    console.log(error, ", in the comment edit")
                }
                finally {
                    setLoading(false)
                }

            }
        }
        else {
            enqueueSnackbar("You Can only Edit your comments", { variant: "error" })
        }
    }

    return (
        <div className="commentWrapper">
            <div className="comment">
                <Link to={`/${comment?.user.username}`} className="linkClass linkClassComment" key={comment?.user._id}>
                    <ul key={comment?.user.username} className="commentListData">
                        <li>
                            <img loading="lazy" src={comment?.user.profilePicture ?
                                comment?.user.profilePicture.startsWith("http") ? comment?.user.profilePicture :
                                    PF + comment?.user.profilePicture : `${PF}avatars/${comment?.user.gender}.png`}
                                className="userLikeImg" alt="" />
                        </li>
                        <li className="userCommentName">
                            <span>
                                {comment?.user.name}
                            </span>
                            {comment?.user.isAdmin &&
                                <span title="Verified Badge" className="verifiedBadgeInComment">
                                    <Star htmlColor="#1877f2" style={{ fontSize: smallWindow ? "1rem" : "1.2rem" }} />
                                </span>

                            }
                        </li>
                    </ul>
                </Link>
                <span className="commentDate">{format(comment.createdAt)}</span>
            </div>

            {
                editCommentOpened ?
                    <div className="editComment">
                        <input ref={content} type="text"
                            className="commentInput" defaultValue={`${comment.comment}`} autoFocus
                        />
                        <div className="editBtns">

                            <button className="editBtn saveEditBtn" disabled={loading} onClick={saveEditComment}>
                                {
                                    loading ?
                                        <Loader size="12px" />
                                        :
                                        "Save"
                                }
                            </button>
                            <button className="editBtn cancelBtn" disabled={loading} onClick={cancelEditComment}>Cancel</button>
                        </div>
                    </div>
                    :
                    <>
                        <p className="commentText">{comment?.comment}</p>


                        <div className="crudComment">
                            <span className="commentCrud">Like</span>
                            <span className="commentCrud">Reply</span>
                            {
                                user._id === comment.user._id &&
                                <>
                                    <span className="commentCrud" onClick={handleEditComment}>Edit</span>
                                    <span className="commentCrud" onClick={handleDeleteComment}>Delete</span>
                                </>
                            }
                        </div>
                    </>

            }



        </div>
    )
}

export default Comment
