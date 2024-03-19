import "./closeFriends.css"


function CloseFriends({ user }) {
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";

    return (
        <li className="sidebarFriend">
            <img loading="lazy" src={PF + user.profilePicture} alt="" className="sidebarFriendImg" />
            <span className="sideFrinedName">{user.username}</span>
        </li>

    )
}

export default CloseFriends
