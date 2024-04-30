import "./postLikes.css"
import { Link } from "react-router-dom"


import { PF } from "../../global-links"
function PostLikes({ postUsersLikes }) {
    return (
        <div className="likesWrapper">
            <div className="postLikesTop">
                <span className="numberOfLikes">{postUsersLikes.length} Likes</span>
                {/*<CloseIcon className="closeIcon" onClick={handleClose} />*/}
            </div>
            <hr />
            <div className="likesContainer">
                {
                    postUsersLikes?.map((user) => (

                        <Link to={`/${user?.username}`} className="linkClass" key={user?._id}>
                            <ul key={user._id} className="likeListData">
                                <li>
                                    <img src={user.profilePicture ? PF + user.profilePicture : `${PF}avatars/${user.gender}.png`} className="userLikeImg" alt="" />
                                </li>
                                <li className="userLikeName">{user.name}</li>
                            </ul>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default PostLikes
