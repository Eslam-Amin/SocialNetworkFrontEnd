import { PF } from "../../global-links"
import { format } from "timeago.js"
import "./message.css"

function Message({ message, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img loading="lazy" src={message.sender.profilePicture ?
                    message.sender.profilePicture.startsWith("http") ? message.sender.profilePicture :
                        PF + message.sender.profilePicture : `${PF}avatars/${message.sender.gender}.png`}
                    className="messageImg" alt={message.sender.name + " image"} />
                <p className="messageTxt">
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">
                {
                    format(message.createdAt)
                }
            </div>
        </div>
    )
}

export default Message
