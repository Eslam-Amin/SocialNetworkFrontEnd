import "./closeFriends.css"


const PF = "https://social-media-network.netlify.app/assets/";
function CloseFriends({ user }) {

    return (
        <li className="sidebarFriend">
            <img loading="lazy" src={PF + user.profilePicture} alt="" className="sidebarFriendImg" />
            <span className="sideFrinedName">{user.username}</span>
        </li>

    )
}

export default CloseFriends
