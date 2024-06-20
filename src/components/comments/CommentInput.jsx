import "./comments.css"
// import { MoreVert, Star } from '@mui/icons-material';
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PF } from "../../global-links"
import { useRef } from "react";
import { useSnackbar } from 'notistack';

function CommentInput({ post, user, updateNumberOfComments }) {
    const content = useRef()
    const { enqueueSnackbar } = useSnackbar();

    const submitComment = async (e) => {
        e.preventDefault()
        if (content.current.value.trim().length !== 0) {
            try {
                const commentValue = content.current.value.trim();
                content.current.value = "";
                await axios.post(`/posts/${post._id}/comments`, { comment: commentValue })
                updateNumberOfComments(true)
            } catch (err) {

                console.log(err, " in commentInput Create Comment")
            }

        } else {
            enqueueSnackbar("You Can't add an empty comment ", { variant: "error" })
        }
    }
    return (
        <div className="commentSection">
            <Link to={`/${user.username}`} className="linkClass linkClassCommentSection">
                <img loading="lazy" src={user.profilePicture ?
                    user.profilePicture.startsWith("http") ? user.profilePicture :
                        PF + user.profilePicture : `${PF}avatars/${user.gender}.png`}
                    className="postProfileImg" alt="" />
            </Link>
            <input ref={content} type="text"
                className="commentInput" placeholder={`Write Your Comment`} />
            <button className="commentBtn" onClick={submitComment}>Comment</button>
        </div>
    )
}

export default CommentInput
