import { PF } from "../../global-links"
import "./chatOnline.css"

function ChatOnline({ onlineUser }) {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img loading="lazy" src={onlineUser.profilePicture ?
                        onlineUser.profilePicture.startsWith("http") ? onlineUser.profilePicture :
                            PF + onlineUser.profilePicture : `${PF}avatars/${onlineUser.gender}.png`}
                        className="chatOnlineImg" alt={onlineUser.name + " image"} />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">
                    {
                        onlineUser.name
                    }
                </span>
            </div>
        </div>
    )
}

export default ChatOnline
