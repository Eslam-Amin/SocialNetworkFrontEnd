
import "./comments.css"
import Comment from "./Comment";
import CloseIcon from '@mui/icons-material/Close';

function Comments({ user, post,
    handleCloseComments,
    postComments,
    deleteCommentAndUpdateCommentSection,
}) {



    const handleClose = () => {
        handleCloseComments()
    }

    return (
        <div className="commentsPopup">
            <div className="postLikesTop">
                <span className="numberOfLikes">{postComments?.length} Comments</span>
                <CloseIcon className="closeIcon" onClick={handleClose} />
            </div>
            <hr />
            <div className="commentsContainer">
                {
                    postComments?.map((comment) => (
                        <Comment
                            comment={comment}
                            user={user} post={post._id}
                            key={comment._id}
                            deleteCommentAndUpdateCommentSection={deleteCommentAndUpdateCommentSection}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Comments
