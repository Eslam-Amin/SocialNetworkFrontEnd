import "./postLikes.css"
import { Link } from "react-router-dom"
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
                                <img src={user.profilePicture ? PF + user.profilePicture : PF + "/person/noProfile.png"} className="userLikeImg" alt="" />
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
