import { Link } from "react-router-dom"
import { PF } from "../../global-links"
import { format } from "timeago.js"
import { Star } from '@mui/icons-material';

import "./comments.css"
import axios from "../../axios";
import { useSnackbar } from 'notistack';

function Comment({ comment, user, post, deleteCommentAndUpdateCommentSection }) {
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    const { enqueueSnackbar } = useSnackbar();

    const handleDeleteComment = async () => {
        try {

            if (comment.user._id === user._id) {
                await axios.delete(`/posts/${post}/comments/${comment._id}`)
                deleteCommentAndUpdateCommentSection(comment._id)
                enqueueSnackbar("Comment Deleted Successfully", { variant: "success" })

            }
            else {
                enqueueSnackbar("you can only DELETE your Own Comment", { variant: "error" })
            }
        } catch (error) {
            console.log(error, " in Comments handleDeleteComment")
        }
    }
    return (
        <div className="commentWrapper">
            <div className="comment">
                <Link to={`/${comment?.user.username}`} className="linkClass linkClassComment" key={comment?.user._id}>
                    <ul key={comment?.user.username} className="commentListData">
                        <li>
                            <img src={comment?.user.profilePicture ? PF + comment?.user.profilePicture :
                                `${PF}avatars/${comment?.user.gender}.png`} className="userLikeImg" alt="" />
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
            <p className="commentText">{comment?.comment}</p>
            {
                user._id === comment.user._id &&
                <div className="crudComment">
                    <span className="commentCrud">Like</span>
                    <span className="commentCrud">Reply</span>
                    <span className="commentCrud">Edit</span>
                    <span className="commentCrud" onClick={handleDeleteComment}>Delete</span>
                </div>
            }
        </div>
    )
}

export default Comment
