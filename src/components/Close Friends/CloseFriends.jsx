import "./closeFriends.css"


import { PF } from "../../global-links"
function CloseFriends({ user }) {

    return (
        <li className="sidebarFriend">
            <img loading="lazy" src={PF + user.profilePicture} alt="" className="sidebarFriendImg" />
            <span className="sideFrinedName">{user.username}</span>
        </li>

    )
}

export default CloseFriends
