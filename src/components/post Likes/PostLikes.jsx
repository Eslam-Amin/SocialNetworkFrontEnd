import "./postLikes.css"
import axios from "axios";
import { Link, redirect } from "react-router-dom"
import CloseIcon from '@mui/icons-material/Close';
function PostLikes({ postUsersLikes }) {
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";

    return (
        <div className="likesContainer">
            <div className="postLikesTop">
                <span className="numberOfLikes">{postUsersLikes.length} Likes</span>
                {/*<CloseIcon className="closeIcon" onClick={handleClose} />*/}
            </div>
            <hr />
            {
                postUsersLikes.map((user) => (

                    <Link to={`/${user?.username}`} className="linkClass">
                        <ul key={user._id} className="likeListData">
                            <li>
                                <img src={PF + user.profilePicture} className="userLikeImg" />
                            </li>
                            <li className="userLikeName">{user.name}</li>
                        </ul>
                    </Link>
                ))
            }
        </div>
    )
}

export default PostLikes
